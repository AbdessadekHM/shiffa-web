
export type NavBarElement = { 
    name: string;
    path: string;
    callBack: () => void;
}



export const unAuthenticatedNavBar: NavBarElement[] = [
    { name: 'Home', path: '/', callBack: () => { } },
    { name: 'Login', path: '/login', callBack: () => { } },
    { name: 'Register', path: '/register', callBack: () => { } }
]
export const authenticatedNavBarUser: NavBarElement[] = [
    { name: 'Dashboard', path: '/dashboard', callBack: () => { } },
    { name: 'Profile', path: '/profile', callBack: () => { } },
    { name: 'Logout', path: 'none', callBack: () => { } }
]



