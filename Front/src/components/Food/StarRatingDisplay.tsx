import React from "react";
import Star from "./Star";

interface StarRatingDisplayProps {
  rating: number;
}

const StarRatingDisplay: React.FC<StarRatingDisplayProps> = ({ rating }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const partial = rating - fullStars;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<Star key={i} fill="gold" />);
    } else if (i === fullStars && partial > 0) {
      stars.push(
        <div key={i} className="relative w-5 h-5">
          <Star fill="lightgray" />
          <div
            className="absolute top-0 left-0 overflow-hidden scale-x-[-1]"
            style={{ width: `${partial * 100}%` }}
          >
            <Star fill="gold" />
          </div>
        </div>
      );
    } else {
      stars.push(<Star key={i} fill="lightgray" />);
    }
  }

  return <div className="flex flex-row-reverse gap-[1px]">{stars}</div>;
};

export default StarRatingDisplay;
