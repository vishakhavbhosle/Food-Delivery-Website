import React, { useState } from 'react'
import logo from "../assets/logo.png"
import { Link } from 'react-router-dom'
import { FaUserAlt } from "react-icons/fa";
import { BsCartFill } from "react-icons/bs";
import { useDispatch, useSelector } from 'react-redux';
import { logoutRedux } from '../redux/userSlice';
import { toast } from 'react-hot-toast'

const Header = () => {

    const [showMenu, setShowMenu] = useState(false);
    const userData = useSelector((state) => state.user)
    console.log(userData.email);
    const dispatch = useDispatch()

    const handleShowMenu = () => {
        setShowMenu(preve => !preve)
    }

    const handleLogout = () => {
        dispatch(logoutRedux())
        toast("Logout successfully")
    }

    const cartItemNumber = useSelector((state) => state.product.cartItem)

    return (
        <div>
            <header className='fixed shadow-md w-full h-20 px2 md:px-4 z-50 bg-white'>
                {/* Dekstop */}
                <div className='flex items-center h-full justify-between'>
                    <Link>
                        <div className='h-20
                        '>
                            <img src={logo} className='h-16' />
                        </div>
                    </Link>

                    <div className='flex items-center gap-4 md:gap-7'>
                        <nav className='gap-4 md:gap-6 text-base md:text-lg hidden md:flex'>
                            <Link to={""}>Home</Link>
                            <Link to={"menu/66be43a8bf56d705bc25bd99"}>Menu</Link>
                            <Link to={"about"}>About</Link>
                            <Link to={"contact"}>Contact</Link>
                        </nav>
                        <div className='text-2xl text-slate-600 relative'>
                            <Link to={"cart"}><BsCartFill />
                                <div className='absolute -top-1 -right-1 text-white bg-red-500 h-4 w-4 rounded-full m-0 p-0 text-sm text-center'>
                                    {cartItemNumber.length}
                                </div>
                            </Link>
                        </div>
                        <div className='text-xl text-slate-600' onClick={handleShowMenu}>
                            <div className='cursor-pointer overflow-hidden drop-shadow-md'>
                                {userData.image ? <img src={userData.image} className='w-10 h-10 rounded-full' /> : <FaUserAlt />}
                            </div>
                            {
                                showMenu &&
                                <div className='absolute right-2 bg-white py-2 shadow drop-shadow-md flex flex-col min-w-[120px] text-center'>
                                    {userData.email === process.env.REACT_APP_ADMIN_EMAIL && (<Link to={"newproduct"} className='whitespace-nowrap px-2 cursor-pointer'>New Product</Link>)}
                                    {
                                        (userData.image) ? <p className="cursor-pointer text-white px-2 bg-red-500" onClick={handleLogout}>Logout ({userData.firstName}) </p> : <Link to={"login"} className="whitespace-nowrap cursor-pointer px-2">Login</Link>
                                    }
                                    <nav className='text-base md:text-lg flex flex-col md:hidden'>
                                        <Link to={""} className='px-2 py-1'>Home</Link>
                                        <Link to={"menu/66be43a8bf56d705bc25bd99"} className='px-2 py-1'>Menu</Link>
                                        <Link to={"about"} className='px-2 py-1'>About</Link>
                                        <Link to={"contact"} className='px-2 py-1'>Contact</Link>
                                    </nav>
                                </div>
                            }
                        </div>
                    </div>
                </div>

            </header>

        </div>
    )
}

export default Header