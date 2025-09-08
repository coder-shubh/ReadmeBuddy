// "use client";

// import { useEffect } from 'react';

// declare global {
//   interface Window {
//     adsbygoogle: any;
//   }
// }

// export const Adsense = () => {
//   useEffect(() => {
//     try {
//       (window.adsbygoogle = window.adsbygoogle || []).push({});
//     } catch (err) {
//       console.error(err);
//     }
//   }, []);

//   return (
//     <div style={{ width: "100%" }}>
//       <ins
//         className="adsbygoogle"
//         style={{ display: 'block' }}
//         data-ad-client="ca-pub-9542271423351303"
//         data-ad-slot="3122771563"
//         data-ad-format="auto"
//         data-full-width-responsive="true"
//       ></ins>
//     </div>
//   );
// };
"use client";

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle: any;
  }
}

export const Adsense = () => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adRef.current) return;

    // Clear previous ad if any
    adRef.current.innerHTML = "";

    const ins = document.createElement("ins");
    ins.className = "adsbygoogle";
    ins.style.display = "block";
    ins.setAttribute("data-ad-client", "ca-pub-9542271423351303");
    ins.setAttribute("data-ad-slot", "3122771563");
    ins.setAttribute("data-ad-format", "auto");
    ins.setAttribute("data-full-width-responsive", "true");

    adRef.current.appendChild(ins);

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("Adsense error", e);
    }
  }, []);

  return <div style={{ width: "100%" }} ref={adRef}></div>;
};
