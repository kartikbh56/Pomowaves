/* eslint-disable react/prop-types */
export default function TotalFocusHours({ totalFocusMinutes }) {
  const hours = Math.floor(totalFocusMinutes / 60);
  const minutes = Math.floor(totalFocusMinutes % 60);

  return (
    <div style={{display:"flex",justifyContent:"center", marginTop:"10px",fontSize:"18px"}}>
      <div style={{fontWeight:"700", margin:"2px 4px"}}>Total time focused :</div>
      <div style={{fontWeight:"bold",margin:"2px 4px", color:"rgb(220, 122, 122)"}}>{hours + "h " + minutes + "m"}</div>
    </div>
  );
}
