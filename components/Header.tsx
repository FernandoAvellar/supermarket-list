import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Header = () => {
    return (
        <header className='flex gap-4 items-center justify-center h-fit p-2'>
            <div>
                <Link href="/" >
                    <Image
                        src='icons/supermarket.svg'
                        width={50}
                        height={50}
                        alt='logo'
                    />
                </Link>
            </div>
            <div>
                <h1 className='text-xl font-semibold tracking-wide'>Lista de compras</h1>
            </div>
        </header>
    )
}

export default Header