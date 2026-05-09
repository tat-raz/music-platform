import { FC, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header/Header';
import style from './UserDetails.module.scss';

interface UserEvent {
  id: string;
  type: string;
  metadata?: string;
  timestamp: string;
}

interface UserDetailsData {
  id: string;
  name: string;
  email: string;
  role: string;
  riskScore: number;
  createdAt: string;
  updatedAt: string;
  events: UserEvent[];
}

export const UserDetails: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState<UserDetailsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem('token');

      if (!token || !id) {
        setError('User id or token not found');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5001/api/admin/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || 'Failed to fetch user details');
          return;
        }

        setUser(data.user);
      } catch (error) {
        setError('Server connection error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);

  const getRiskImpact = (eventType: string): string => {
    if (eventType === 'login_failed') return '+10';
    if (eventType === 'cart_add_warning') return '+5';
    if (eventType === 'cart_add_blocked') return '+10';
    if (eventType === 'login_success') return '-5';

    return '0';
  };

  return (
    <div className={style.UserDetails}>
      <Header />

      <div className={style.container}>
        <button className={style.backButton} onClick={() => navigate('/admin')}>
          Back to dashboard
        </button>

        {isLoading && <div className={style.message}>Loading user...</div>}

        {error && <div className={style.error}>{error}</div>}

        {user && (
          <>
            <div className={style.userCard}>
              <h1 className={style.title}>{user.name}</h1>

              <div className={style.infoGrid}>
                <div>
                  <span>Email</span>
                  <strong>{user.email}</strong>
                </div>

                <div>
                  <span>Role</span>
                  <strong>{user.role}</strong>
                </div>

                <div>
                  <span>Risk Score</span>
                  <strong>{user.riskScore}</strong>
                </div>

                <div>
                  <span>Created At</span>
                  <strong>{new Date(user.createdAt).toLocaleDateString()}</strong>
                </div>
              </div>
            </div>

            <div className={style.timelineBlock}>
              <h2 className={style.sectionTitle}>Risk Timeline</h2>

              <div className={style.timeline}>
                {user.events.map((event) => (
                  <div className={style.timelineItem} key={event.id}>
                    <div>
                      <strong>{event.type}</strong>
                      <p>{new Date(event.timestamp).toLocaleString()}</p>
                    </div>

                    <span
                      className={
                        getRiskImpact(event.type).startsWith('+')
                          ? style.positiveImpact
                          : style.negativeImpact
                      }
                    >
                      {getRiskImpact(event.type)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className={style.eventsBlock}>
              <h2 className={style.sectionTitle}>User Events</h2>

              <div className={style.tableWrapper}>
                <table className={style.table}>
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>Metadata</th>
                      <th>Time</th>
                    </tr>
                  </thead>

                  <tbody>
                    {user.events.map((event) => (
                      <tr key={event.id}>
                        <td>{event.type}</td>
                        <td>{event.metadata || '-'}</td>
                        <td>{new Date(event.timestamp).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};