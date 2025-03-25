import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import http from '../../http';
import {ApiResponse} from "../../types/ArtifactsTypes.ts";


interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await http.post<ApiResponse<string>>(`/user/login`, {
        email: formData.email,
        password: formData.password
      });

      if (response.data.code == 0) {

        console.log(response.data);
        localStorage.setItem('auth_token', response.data.data);
        navigate('/');

      } else {

        console.log(response.data);
        setError(response.data.message || '登录失败');

      }

    } catch (err: any) {

      if (err.response) {

        setError(err.response.data?.message || '服务器错误');
      } else if (err.request) {

        setError('无法连接服务器，请检查网络');
      } else {

        setError('请求发送失败');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="login-container">
        <h2>用户登录</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>邮箱</label>
            <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="请输入邮箱"
                required
            />
          </div>

          <div className="form-group">
            <label>密码</label>
            <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="请输入密码"
                required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? '登录中...' : '登录'}
          </button>
        </form>
      </div>
  );
}