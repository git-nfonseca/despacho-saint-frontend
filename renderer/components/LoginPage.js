import getConfig from 'next/config'
import { useRouter } from 'next/router'
import React, { useContext, useState, useRef } from 'react'
import AppConfig from '../../../layout/AppConfig'
import { Button } from 'primereact/button'
import { Password } from 'primereact/password'
import { LayoutContext } from '../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext'
import { classNames } from 'primereact/utils'
import axios from "axios"
import { useCookies } from "react-cookie"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { toast } from "react-toastify"

import path from 'path'
import { promises as fs } from 'fs'



const LoginPage = () => {
    const [credentials, setCredentials] = useState({
        username: "",
        password: "",
      })
    const [cookie, setCookie] = useCookies(["Tokendespacho"])
    const { layoutConfig } = useContext(LayoutContext)
    const contextPath = getConfig().publicRuntimeConfig.contextPath
    const apiLogin = getConfig().publicRuntimeConfig.api
    const router = useRouter()

    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', {'p-input-filled': layoutConfig.inputStyle === 'filled'});

    const handleSubmit = async (e) => {
        try {
            e.preventDefault() 
            axios.interceptors.response.use(response => {
                return response
            }, error => {
             toast('Nombre de Usuario o Contraseña no Válidos', { hideProgressBar: true, autoClose: 4000, type: 'error' })
            return error
            })

            const jsonDirectory = path.join(process.cwd(), '')
            const fileContents = await fs.readFile(jsonDirectory + '/config.json', 'utf8')
            const data = JSON.parse(fileContents)


           const res = await axios.post(data.config.api_v1 + "auth/login", credentials, '{ withCredentials: true }')
            //console.log(JSON.stringify(res.data))
            if (res.status === 200) {
              setCookie("Tokendespacho", JSON.stringify(res.data.token), {
                path: "/",
                maxAge: 3600, // Expires after 1hr
                
              })
             /* const usrdat = {
                  'usuario' : 'pepito',
                  'rol' : 99
              }
              localStorage.setItem('user', JSON.stringify(usrdat));*/
              router.push("/home");
            } else {
                
            }
                
        } catch (e) {
            console.log('error : ' + e)            
        }
      }

    return (
        <div className={containerClassName}>
            <ToastContainer/>
            <div className="flex flex-column align-items-center justify-content-center">
              {/*  <img src={`${contextPath}/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0"/> */}
                <div style={{ borderRadius: '56px', padding: '0.3rem', background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)' }}>
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <img src={`${contextPath}/demo/images/login/user.svg`} alt="Image" height="50" className="mb-3" />
                            <div className="text-900 text-3xl font-medium mb-3">Bienvenido!</div>
                            <span className="text-600 font-medium">Inicia sesión para continuar</span>
                        </div>

                        <div>
                          <form onSubmit={handleSubmit}>
                            <label htmlFor="username" className="block text-900 text-xl font-medium mb-2">
                                Usuario
                            </label>
                            <InputText inputid="username" onChange= {(e) => setCredentials({...credentials, username: e.target.value})} type="text" placeholder="Nombre de usuario" className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} />

                            <label htmlFor="password" className="block text-900 font-medium text-xl mb-2">
                                Password
                            </label>
                            <Password inputid="password"  onChange={(e) => setCredentials({...credentials, password: e.target.value})} placeholder="Password" toggleMask className="w-full mb-5" inputClassName='w-full p-3 md:w-30rem'></Password>

                            <Button label="Aceptar" className="w-full p-3 text-xl" onClick={() => router.push('/')}></Button>
                          </form>  
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
        
    )
}

LoginPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig simple />
        </React.Fragment>
    );
};
export default LoginPage
