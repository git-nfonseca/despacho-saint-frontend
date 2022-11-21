import getConfig from 'next/config';
import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const model = [
        {
            label: 'Configuración',
            items: [
                { label: 'Choferes', icon: 'pi pi-fw pi-id-card', to: '/choferes' },
                { label: 'Zonas', icon: 'pi pi-fw pi-check-square', to: '/rutas' },
                { label: 'Transportes', icon: 'pi pi-truck', to: '/transportes' },
                { label: 'Usuarios', icon: 'pi pi-users', to: '/home' },
            ]
        },
        {
            label: 'Despacho',
            items: [
                { label: 'Despachos', icon: 'pi pi-calendar-plus', to: '/despachos', badge: 'NEW' },
            ]
        },
        {
            label: 'Reportes',
            items: [
                { label: 'Listado de Despachos', icon: 'pi pi-print', to: '/home' },
            ]
        },

        {
            label: 'Salir',
            items: [
                { label: 'Salir', icon: 'pi pi-sign-out', to: '/' },
            ]
        },


    ]

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}

            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
