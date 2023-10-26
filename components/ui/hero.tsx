'use client';
import { useState } from 'react';
import { Button } from './button';
import Link from 'next/link';

type HeroProps = {
  title: string;
  subTitle: string;
  color: string;
};

const Hero = ({ title, subTitle, color }: HeroProps) => {
  const [counter, setCounter] = useState(0);

  return (
    <div className="py-10 bg-green-800 w-full">
      <div className="container text-white text-center ">
        <h1
          className=" text-3xl mb-2"
          style={{
            color: color,
          }}
        >
          {title}
        </h1>
        <p className="w-full md:w-1/2 m-auto">{subTitle}</p>
        <Button
          onClick={() => {
            setCounter(counter + 1);
          }}
        >
          counter {counter}
        </Button>
        <Link href="/home">
          <Button>Go to your home page</Button>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
