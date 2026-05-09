import { FC, useEffect, useState } from 'react';
import { Header } from '../../components/Header/Header';
import style from './AdminDashboard.module.scss';
import { useNavigate } from 'react-router-dom';


interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  riskScore: number;
  createdAt: string;
  updatedAt: string;
}

interface SecurityStats {
  totalUsers: number;
  highRiskUsers: number;
  totalEvents: number;
  blockedActions: number;
}

export const AdminDashboard: FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [events, setEvents] = useState<any[]>([]);
  const [stats, setStats] = useState<SecurityStats | null>(null);
  const [eventFilter, setEventFilter] = useState<string>('all');
  const [userSearch, setUserSearch] = useState<string>('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Token not found');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5001/api/admin/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || 'Failed to fetch users');
          return;
        }

          setUsers(data.users);
      } catch (error) {
          setError('Server connection error');
      } finally {
          setIsLoading(false);
      }
    };

    const fetchEvents = async () => {
      const token = localStorage.getItem('token');

      try {
        const res = await fetch('http://localhost:5001/api/admin/events', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setEvents(data.events);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchStats = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await fetch('http://localhost:5001/api/admin/stats', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    const fetchDashboardData = () => {
      fetchUsers();
      fetchEvents();
      fetchStats();
    };

    fetchDashboardData();

    const intervalId = setInterval(fetchDashboardData, 10000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const getRiskClassName = (riskScore: number): string => {
      if (riskScore >= 70) return style.highRisk;
      if (riskScore >= 30) return style.mediumRisk;
      return style.lowRisk;
  };

  const filteredEvents = events.filter((event) => {
    if (eventFilter === 'all') return true;
    if (eventFilter === 'login') return event.type.includes('login');
    if (eventFilter === 'cart') return event.type.includes('cart');
    if (eventFilter === 'blocked') return event.type.includes('blocked');
    if (eventFilter === 'failed') return event.type.includes('failed');

    return true;
  });

  const filteredUsers = users.filter((user) => {
    const search = userSearch.toLowerCase();

    return (
      user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search) ||
      user.role.toLowerCase().includes(search)
    );
  });

  const eventStats = events.reduce<Record<string, number>>((acc, event) => {
    acc[event.type] = (acc[event.type] || 0) + 1;
    return acc;
  }, {});

  const maxEventCount = Math.max(...Object.values(eventStats), 1);

  const lowRiskUsers = users.filter((user) => user.riskScore < 30).length;

  const mediumRiskUsers = users.filter(
    (user) => user.riskScore >= 30 && user.riskScore < 70
  ).length;

  const highRiskUsers = users.filter((user) => user.riskScore >= 70).length;

  const riskDistribution = [
    {
      label: 'Low Risk',
      value: lowRiskUsers,
      className: style.lowRiskBar,
    },
    {
      label: 'Medium Risk',
      value: mediumRiskUsers,
      className: style.mediumRiskBar,
    },
    {
      label: 'High Risk',
      value: highRiskUsers,
      className: style.highRiskBar,
    },
  ];

  const maxRiskCount = Math.max(
    lowRiskUsers,
    mediumRiskUsers,
    highRiskUsers,
    1
  );

  const exportEventsToCSV = () => {
    const headers = ['User', 'Email', 'Event', 'Metadata', 'Time'];

    const rows = filteredEvents.map((event) => [
      event.user?.name || '',
      event.user?.email || '',
      event.type,
      event.metadata || '',
      new Date(event.timestamp).toLocaleString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'security-events.csv';
    link.click();

    URL.revokeObjectURL(url);
  };

  const suspiciousUsers = users.filter((user) => user.riskScore >= 50);

  const hasHighRiskUsers = suspiciousUsers.length > 0;

  return (
    <div className={style.AdminDashboard}>
      <Header />

      <div className={style.container}>
        <div className={style.headerBlock}>

          {stats && (
            <div className={style.statsGrid}>
              <div className={style.statCard}>
                <span className={style.statLabel}>Total Users</span>
                <strong className={style.statValue}>{stats.totalUsers}</strong>
              </div>

              <div className={style.statCard}>
                <span className={style.statLabel}>High Risk Users</span>
                <strong className={style.statValue}>{stats.highRiskUsers}</strong>
              </div>

              <div className={style.statCard}>
                <span className={style.statLabel}>Total Events</span>
                <strong className={style.statValue}>{stats.totalEvents}</strong>
              </div>

              <div className={style.statCard}>
                <span className={style.statLabel}>Blocked Actions</span>
                <strong className={style.statValue}>{stats.blockedActions}</strong>
              </div>
            </div>
          )}

          <div className={style.chartBlock}>
            <h2 className={style.sectionTitle}>Events by Type</h2>

            <div className={style.chart}>
              {Object.entries(eventStats).map(([type, count]) => (
                <div className={style.chartRow} key={type}>
                  <div className={style.chartLabel}>{type}</div>

                  <div className={style.chartBarWrapper}>
                    <div
                      className={style.chartBar}
                      style={{ width: `${(count / maxEventCount) * 100}%` }}
                    />
                  </div>

                  <div className={style.chartValue}>{count}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={style.chartBlock}>
            <h2 className={style.sectionTitle}>Risk Distribution</h2>

            <div className={style.chart}>
              {riskDistribution.map((item) => (
                <div className={style.chartRow} key={item.label}>
                  <div className={style.chartLabel}>{item.label}</div>

                  <div className={style.chartBarWrapper}>
                    <div
                      className={`${style.chartBar} ${item.className}`}
                      style={{ width: `${(item.value / maxRiskCount) * 100}%` }}
                    />
                  </div>

                  <div className={style.chartValue}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          {suspiciousUsers.length > 0 && (
            <div className={style.suspiciousBlock}>
              <h2 className={style.sectionTitle}>Suspicious Users</h2>

              <div className={style.tableWrapper}>
                <table className={style.table}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Risk Score</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {suspiciousUsers.map((user) => (
                      <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>
                          <span className={`${style.riskBadge} ${getRiskClassName(user.riskScore)}`}>
                            {user.riskScore}
                          </span>
                        </td>
                        <td>
                          <button
                            className={style.detailsButton}
                            onClick={() => navigate(`/admin/users/${user.id}`)}
                          >
                            View details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <h1 className={style.title}>Security Dashboard</h1>
          <p className={style.subtitle}>
            Developer panel for monitoring users and risk scores.
          </p>
        </div>

        {hasHighRiskUsers && (
          <div className={style.alertBanner}>
            ⚠ {suspiciousUsers.length} high risk user
            {suspiciousUsers.length > 1 ? 's' : ''} detected
          </div>
        )}

        {isLoading && (
            <div className={style.message}>Loading users...</div>
        )}

        {error && (
            <div className={style.error}>{error}</div>
        )}

        <div className={style.searchBlock}>
          <input
            className={style.searchInput}
            type="text"
            placeholder="Search users..."
            value={userSearch}
            onChange={(event) => setUserSearch(event.target.value)}
          />
        </div>

        {!isLoading && !error && (
          <div className={style.tableWrapper}>
            <table className={style.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Risk Score</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={style.roleBadge}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`${style.riskBadge} ${getRiskClassName(user.riskScore)}`}>
                        {user.riskScore}
                      </span>
                    </td>
                    <td>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <button
                        className={style.detailsButton}
                        onClick={() => navigate(`/admin/users/${user.id}`)}
                      >
                        View details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className={style.eventsBlock}>

          <div className={style.sectionHeader}>
            <h2 className={style.sectionTitle}>Event Log</h2>

            <button
              className={style.exportButton}
              onClick={exportEventsToCSV}
            >
              Export Events
            </button>
          </div>

          <div className={style.filters}>
            <button
              className={eventFilter === 'all' ? style.activeFilter : style.filterButton}
              onClick={() => setEventFilter('all')}
            >
              All
            </button>

            <button
              className={eventFilter === 'login' ? style.activeFilter : style.filterButton}
              onClick={() => setEventFilter('login')}
            >
              Login
            </button>

            <button
              className={eventFilter === 'cart' ? style.activeFilter : style.filterButton}
              onClick={() => setEventFilter('cart')}
            >
              Cart
            </button>

            <button
              className={eventFilter === 'blocked' ? style.activeFilter : style.filterButton}
              onClick={() => setEventFilter('blocked')}
            >
              Blocked
            </button>

            <button
              className={eventFilter === 'failed' ? style.activeFilter : style.filterButton}
              onClick={() => setEventFilter('failed')}
            >
              Failed
            </button>
          </div>

          <div className={style.tableWrapper}>
            <table className={style.table}>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Event</th>
                  <th>Metadata</th>
                  <th>Time</th>
                </tr>
              </thead>

              <tbody>
                {filteredEvents.map((event) => (
                  <tr key={event.id}>
                    <td>{event.user?.name}</td>
                    <td>{event.user?.email}</td>
                    <td>{event.type}</td>
                    <td>{event.metadata}</td>
                    <td>
                      {new Date(event.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};