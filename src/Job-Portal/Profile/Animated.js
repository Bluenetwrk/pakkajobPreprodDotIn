import React from "react";
import "./Animated.css";

function Animation() {
  return (
    <div className="coupon-overlay">

      {/* Confetti */}
      <div className="confetti">🎉</div>
      <div className="confetti">🎊</div>
      <div className="confetti">✨</div>
      <div className="confetti">🎉</div>
      <div className="confetti">🎊</div>
      <div className="confetti">✨</div>
      <div className="confetti">🎉</div>
      <div className="confetti">🎊</div>

      {/* Success Box */}
      <div className="coupon-box">

        <div className="trophy">🏆</div>

        <h1>Congratulations! 🎉</h1>

        <p>Your buisness Account got verfied!</p>
        {/* <p className="enjoy">
          Enjoy your reward! 🎊
        </p> */}

      </div>
    </div>
  );
}

export default Animation;