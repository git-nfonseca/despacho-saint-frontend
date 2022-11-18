import getConfig from 'next/config'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast'
import { Toolbar } from 'primereact/toolbar'
import { classNames } from 'primereact/utils'
import React, { useEffect, useRef, useState } from 'react'
import axios from "axios"

import path from 'path';
import { promises as fs } from 'fs';


const Rutas = () => {

    let emptyRuta = {
        id: null,
        descripcion: ''
    }

    const [rutas, setRutas] = useState(null)
    const [productDialog, setProductDialog] = useState(false)
    const [deleteProductDialog, setDeleteProductDialog] = useState(false)
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false)
    const [ruta, setRuta] = useState(emptyRuta)
    const [selectedRutas, setSelectedRutas] = useState(null)
    const [submitted, setSubmitted] = useState(false)
    const [globalFilter, setGlobalFilter] = useState(null)
    const [apiUrl, setApiUrl] = useState('')
    const toast = useRef(null)
    const dt = useRef(null)
    const apiLogin = getConfig().publicRuntimeConfig.api
    //const apiLogin = apiUrl
    
  
const  getListaDeRutas = async () => {
  try {
   // axios.defaults.withCredentials = true   
   //let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmVzSW4iOiI3ZCIsImlkIjo2LCJmaXJzdE5hbWUiOiJOZWxzb24gT21hciIsImxhc3ROYW1lIjoiRm9uc2VjYSBMZWRlem1hIiwidXNlcm5hbWUiOiJuZWxzb24iLCJyb2wiOjAsImlhdCI6MTY2NzY2MzI1OH0.W1893iwFjeJ3J_j3AQUlSAk2NqGQeObFUYp9tICkH-8; Max-Age=604800; Path=/; HttpOnly"

   const jsonDirectory = path.join(process.cwd(), '')
   const fileContents = await fs.readFile(jsonDirectory + '/config.json', 'utf8')
   const data = JSON.parse(fileContents)
   const res = await axios.get( data.config.api_v1 + 'ruta',{
   //   withCredentials: true , 
      //Cookie: 'Tokendespacho=%22Tokendespacho%3DeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmVzSW4iOiI3ZCIsImlkIjo2LCJmaXJzdE5hbWUiOiJOZWxzb24gT21hciIsImxhc3ROYW1lIjoiRm9uc2VjYSBMZWRlem1hIiwidXNlcm5hbWUiOiJuZWxzb24iLCJyb2wiOjAsImlhdCI6MTY2NzY0OTY2Nn0.qukfD2k79_VWGuW_9qezBl9N-uFguBz188Tf4c0jBtI%3B%20Max-Age%3D604800%3B%20Path%3D%2F%3B%20HttpOnly%3B%20SameSite%3DStrict%22 ',
      headers: {
       // 'Cookie': 'Tokendespacho=%22Tokendespacho%3DeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmVzSW4iOiI3ZCIsImlkIjo2LCJmaXJzdE5hbWUiOiJOZWxzb24gT21hciIsImxhc3ROYW1lIjoiRm9uc2VjYSBMZWRlem1hIiwidXNlcm5hbWUiOiJuZWxzb24iLCJyb2wiOjAsImlhdCI6MTY2NzY0OTY2Nn0.qukfD2k79_VWGuW_9qezBl9N-uFguBz188Tf4c0jBtI%3B%20Max-Age%3D604800%3B%20Path%3D%2F%3B%20HttpOnly%3B%20SameSite%3DStrict%22 ',
       // 'Authorization': `${token}`,
        'Content-Type': 'application/json',
      //  'Access-Control-Allow-Origin' : 'http://localhost:8888'
      }              
    },) 
    const lista1 = await res.data    
    setRutas(lista1) 
    //const dat = JSON.stringify(localStorage.getItem('user'))
    //console.log('datos guardado en localstaorage : ' + JSON.stringify(dat) )
   } catch (error) {
    console.error('error : ' + error);
   }              
 }
//********************************** */
useEffect(() => {          
    const fetchListaDeRutas = async () => {
        //getApiUrl()
        getListaDeRutas()  
    }
    fetchListaDeRutas()
  }, [])
  //***************************************** */

    const openNew = () => {
        setRuta(emptyRuta)
        setSubmitted(false)
        setProductDialog(true)
    };

    const hideDialog = () => {
        setSubmitted(false)
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false)
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false)
    }
//********************************************* */
const updateRutaByid = async (id,datos) => {
    let estatus = 0
    try {        
        const res = await axios.put(apiLogin + `ruta/${id}`, datos, {
              headers: {
              //'Access-Control-Allow-Origin' : 'http://localhost:8888',   
              'Content-Type': 'application/json',
              //'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
            }              
          })
        estatus = res.status
        return estatus
    } catch (e) {
        estatus = 500
        console.error('error : ' + e)
        return estatus
    }
}
//********************************************* */
const DeleteRutaByid = async(id) => {
    let estatus = 0
    try {
        const res = await axios.delete(apiLogin + `ruta/${id}`,  {
            headers: {
            'Content-Type': 'application/json',
          }              
        })
      estatus = res.status
      return estatus        
    } catch (e) {
        estatus = 500
        console.error('error : ' + e)
        return estatus        
    }
}
//********************************************* */
const createRuta = async (datos) => {
    let respuesta = ''
    
    try {
        const res = await axios.post(apiLogin + `ruta`, datos,  {
            headers: {
            'Content-Type': 'application/json',
          }              
        })
      
    //  console.log (res.data)  
      //console.log('este si es el dato : ' + res.data.ultimo_id)
      respuesta = {
          'estatus' : res.status,
          'ultimo_id': res.data.ultimo_id
      }
      return await respuesta        
    } catch (e) {
        console.error('error : ' + e)
        respuesta = {
            'estatus' : 500,
            'ultimo_id': -1
        }        
        return respuesta        
    }    
}
//********************************************* */
    const saveRuta = async () => {
        setSubmitted(true);
        if (ruta.descripcion.trim()) {
            let _rutas = [...rutas]
            let _ruta = { ...ruta }
            if (ruta.id) {
                //alert('editando chofer')
                const index = findIndexById(ruta.id)
                _rutas[index] = ruta
                const resultado  = await updateRutaByid(ruta.id,_ruta) 
                if (resultado==200) {
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Ruta Actualizada', life: 3000 })
                }else {
                    alert('Error al grabar la ruta')
                }    
            } else {
                // crear un nuevo chofer
                const conf = await createRuta(_ruta)
                _ruta.id = parseInt(conf.ultimo_id)
                _rutas.push(_ruta)
                if (conf.estatus ==200) toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Ruta creada Exitosamente', life: 3000 });
            }

            setRutas(_rutas)
            setProductDialog(false)
            setRuta(emptyRuta)
        }
    }

    const editRuta = (ruta) => {
        setRuta({ ...ruta })
        setProductDialog(true)
    }

    const confirmDeleteRuta = (ruta) => {
        setRuta(ruta)
        setDeleteProductDialog(true)
    };

    const deleteRuta = async () => {
        let _rutas = rutas.filter((val) => val.id !== ruta.id)
        setRutas(_rutas)
        setDeleteProductDialog(false)
        setRuta(emptyRuta)
        const conf = await DeleteRutaByid(ruta.id)
        if (conf ==200)  toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Ruta Eliminada', life: 3000 })
    }

    const findIndexById = (id) => {
        let index = -1
        for (let i = 0; i < rutas.length; i++) {
            if (rutas[i].id === id) {
                index = i
                break;
            }
        }
        return index
    }

   
    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true)
    };

    const deleteSelectedRutas = () => {
        let _rutas = rutas.filter((val) => !selectedRutas.includes(val))
        setRutas(_rutas)
        setDeleteProductsDialog(false)
        setSelectedRutas(null)
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Rutas Eliminadas', life: 3000 })
    }


    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || ''
        let _ruta = { ...ruta }
        _ruta[`${name}`] = val

        setRuta(_ruta)
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                   {/* <Button label="Nuevo" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />*/}
                   {/* <Button label="Eliminar" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedChoferes || !selectedChoferes.length} />*/}
                </div>
            </React.Fragment>
        );
    };

    const codeBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Id</span>
                {rowData.id}
            </>
        )
    }

    const descripcionBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Descripción</span>
                {rowData.descripcion}
            </>
        )
    }


    const actionBodyTemplate = (rowData) => {
        return (
            <>
               {/* <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editRuta(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteRuta(rowData)} />*/}
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Zonas</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const productDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveRuta} />
        </>
    );
    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteRuta} />
        </>
    );
    const deleteProductsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedRutas} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <DataTable
                        ref={dt}
                        value={rutas}
                        selection={selectedRutas}
                        onSelectionChange={(e) => setSelectedRutas(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} rutas"
                        globalFilter={globalFilter}
                        emptyMessage="Choferes No Encontrados."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="id" sortable body={codeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="descripcion" header="descripcion" sortable body={descripcionBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: '450px' }} header="Nueva Ruta" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="descripcion">Descripción</label>
                            <InputText id="descripcion" value={ruta.descripcion} onChange={(e) => onInputChange(e, 'descripcion')} required autoFocus className={classNames({ 'p-invalid': submitted && !ruta.descripcion })} />
                            {submitted && !ruta.descripcion && <small className="p-invalid">Descripcion es requerida</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {ruta && (
                                <span>
                                    Estas seguro de eliminar la ruta: <b>{ruta.descripcion}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {ruta && <span>Estas seguro de Elimiar las Rutas seleccionadas?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    )
}

export default Rutas
