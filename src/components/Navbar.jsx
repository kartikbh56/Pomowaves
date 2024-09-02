/* eslint-disable react/prop-types */
export default function Navbar({dispatch}) {
  // console.log("navbar rendered")
  return (
    <header>
      <div className="logo">
        <img src="icons/logo.png" alt="Pomofocus Logo" className="logo-img" />
        <span>PomoWaves</span>
      </div>
      <div className="buttons">
        <button className="btn" onClick={()=>dispatch({type:'toggleMenu',menu:'reports'})}>
          <img src="icons/report.png" />
          <span>Report</span>
        </button>
        <button className="btn" onClick={()=>dispatch({type:'toggleMenu',menu:'settings'})}>
          <img src="icons/settings.png" />
          <span>Setting</span>
        </button>
        <button className="btn">
          <img src="icons/user.png" />
          <span>Sign in</span>
        </button>
      </div>
    </header>
  );
}
