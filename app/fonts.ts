import localFont from 'next/font/local';

export const turretRoad = localFont({
  src: [
    {
      path: '../public/Turret_Road/TurretRoad-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/Turret_Road/TurretRoad-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/Turret_Road/TurretRoad-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/Turret_Road/TurretRoad-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/Turret_Road/TurretRoad-ExtraBold.ttf',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-turret-road',
}); 