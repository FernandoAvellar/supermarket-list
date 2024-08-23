import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="flex flex-grow items-center justify-center w-full">
        <Image
          src='/images/cover.jpg'
          width={400}
          height={400}
          alt='Supermarket image'
        />
      </div>
    </>
  );
}
