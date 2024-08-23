import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="flex flex-grow items-center justify-center w-full">
        <Image
          src='/images/cover.jpg'
          width={300}
          height={300}
          alt='Supermarket image'
        />
      </div>
    </>
  );
}
