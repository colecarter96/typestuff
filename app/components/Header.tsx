import Link from "next/link";

const Header = () => {
    return(
        <header className="w-full px-8 py-6 flex justify-between items-center">
            <Link href="/" className="text-2xl font-[600] tracking-tight">typestuff</Link>
            <nav className="flex items-center">
                <div className="flex gap-12 text-xl">
                    <Link href="/levels" className=" hover:text-gray-600">Levels</Link>
                    <Link href="/about" className="hover:text-gray-600">About</Link>
                    <Link href="/contact" className="hover:text-gray-600">Contact</Link>
                </div>
            </nav>
        </header>
    );
};

export default Header;