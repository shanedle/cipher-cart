import React from "react";

import Title from "./Title";

const HomeBanner = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-5">
      <Title className="uppercase text-3xl md:text-4xl font-bold text-center">
        Welcome to Cipher Cart
      </Title>
      <p className="text-sm text-center text-lightColor/80 font-medium max-w-[480px] ">
        Discover vintage gadgets beside tomorrow&apos;s tech. Shop Tech
        Nostalgia, Cryptography Collectibles, Future-Tech Home, Encrypted
        Lifestyle, and Digital Security Essentials&nbsp;&mdash;&nbsp;all
        hand-picked for secure shopping.
      </p>
    </div>
  );
};

export default HomeBanner;
