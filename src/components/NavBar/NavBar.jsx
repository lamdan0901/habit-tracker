import './NavBar.scss'
import userAvatar from '../../assets/img/demo-avatar.gif'
export default function NavBar({ clockState }) {
  return (
    <nav className="navbar">
      <div className="">something</div>

      <h3 className="digi-clock">{clockState}</h3>
      <div className="user-info">
        <img src={userAvatar} alt="user-avatar" className="user-avatar" />
        <div className="user-name">Edward</div>
      </div>
    </nav>
  )
}
