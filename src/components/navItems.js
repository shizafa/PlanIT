import { GridIcon, CompassIcon, SuitcaseIcon, HeartIcon, UserIcon, GearIcon } from './icons.jsx'

export const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', Icon: GridIcon },
  { to: '/planner', label: 'Start Planning', Icon: CompassIcon },
  { to: '/trips', label: 'My Trips', Icon: SuitcaseIcon },
  { to: '/favorites', label: 'Favorites', Icon: HeartIcon },
  { to: '/profile', label: 'Profile', Icon: UserIcon },
  { to: '/settings', label: 'Settings', Icon: GearIcon },
]
