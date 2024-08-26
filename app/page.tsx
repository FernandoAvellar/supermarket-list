import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="flex items-center justify-center w-full">
        <Image
          src='/images/cover.jpg'
          width={350}
          height={350}
          alt='Supermarket image'
        />
      </div>
    </>
  );
}
