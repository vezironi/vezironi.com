import Link from "next/link"

const Navbar = () => {
    return (
        <nav className='container mx-auto flex items-center justify-between px-8 py-5 border-b border-b-neutral-400/30 border-dashed'>
            <Link href="/" className='text-sm text-neutral-400 hover:text-white'>~/vezironi</Link>
            <div className='flex items-center space-x-4'>
                <Link href="/about" className='text-sm text-neutral-400 hover:text-white'>/about</Link>
                <Link href="/gallery" className='text-sm text-neutral-400 hover:text-white'>/gallery</Link>
                <Link href="/services" className='text-sm text-neutral-400 hover:text-white'>/services</Link>
                <Link href="/blog" className='text-sm text-neutral-400 hover:text-white'>/blog</Link>
                <Link href="/contact" className='text-sm text-neutral-400 hover:text-white'>/contact</Link>
            </div>
        </nav>
    )
}

export default Navbar