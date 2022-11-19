import getConfig from 'next/config'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast'
import { Toolbar } from 'primereact/toolbar'
import React, { useEffect, useRef, useState } from 'react'
import axios from "axios"
import { useRouter } from 'next/router'
import {generateProductsPDF} from '../../services/reporteProductos'

import path from 'path'
import { promises as fs } from 'fs'


const despachos = () => {
    let emptydespacho = {
        id_despacho: 0,
        FechaE :'',
        FechaR : '',
        id_ruta: 0,
        id_chofer : 0,
        cedula_chofer: '',
        nombre_chofer: '',
        telefono_chofer :'',
        id_transporte : 0,
        placa_transporte :'',
        descripcion_transporte : '',
        la_ruta :'',
        autorizado_por :'',
        responsable :'',
        estatus : 0,
        notas : ''
    };

    const [despachos, setdespachos] = useState(null)
    const [productDialog, setProductDialog] = useState(false)
    const [deleteProductDialog, setDeleteProductDialog] = useState(false)
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false)
    const [despacho, setdespacho] = useState(emptydespacho);
    const [selecteddespachos, setSelecteddespachos] = useState(null)
    const [submitted, setSubmitted] = useState(false)
    const [globalFilter, setGlobalFilter] = useState(null)
    const [productos,setProductos] = useState(null)
    const toast = useRef(null)
    const dt = useRef(null)
    const apiLogin = getConfig().publicRuntimeConfig.api
    const router = useRouter()


//************************* */
 
const  getListaDedespachos = async () => {
  try {

    const jsonDirectory = path.join(process.cwd(), '')
    const fileContents = await fs.readFile(jsonDirectory + '/config.json', 'utf8')
    const data = JSON.parse(fileContents)

   const res = await axios.get( data.config.api_v1 + 'despacho',{
      //withCredentials: true , 
      headers: {
        'Content-Type': 'application/json',
      }              
    },) 
    const lista1 = await res.data     
    //console.log(JSON.stringify(lista1))
    setdespachos(lista1)  
   } catch (error) {
     console.error('error : ' + error);
   }              
 }
//********************************** */
useEffect(() => {          
    const fetchListaDedespachos = async () => {
        getListaDedespachos()      
    }
    fetchListaDedespachos()

  }, [])
  //***************************************** */

    const openNew = () => {
      router.push("/despachos/newdespacho");
    }

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    }
//********************************************* */
const updatedespachoByid = async (id,datos) => {
    let estatus = 0
    try {    
        
        const res = await axios.put(apiLogin + `despacho/${id}`, datos, {
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
const DeletedespachoByid = async(id) => {
    let estatus = 0
    try {
        const res = await axios.delete(apiLogin + `despacho/${id}`,  {
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
const createdespacho = async (datos) => {
    let respuesta = ''
    
    try {
        const res = await axios.post(apiLogin + `transp`, datos,  {
            headers: {
            'Content-Type': 'application/json',
          }              
        })
      
      respuesta = {
          'estatus' : res.status,
          'ultimo_id': res.data.ultimo_id
      }
      console.log(JSON.stringify(respuesta))
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
    const savedespacho = async () => {
        setSubmitted(true);
        if (despacho.descripcion.trim()) {
            let _despachos = [...despachos]
            let _despacho = { ...despacho }
            if (despacho.id) {
                //alert('editando despacho')
                const index = findIndexById(despacho.id)
                _despachos[index] = _despacho
                const resultado  = await updatedespachoByid(despacho.id,_despacho) 
                if (resultado==200) {
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'despacho Actualizado', life: 3000 })
                }else {
                    alert('Error al grabar el despacho')
                }    
            } else {
                // crear un nuevo despacho
                const conf = await createdespacho(_despacho)
                _despacho.id = parseInt(conf.ultimo_id)
                _despachos.push(_despacho)
                if (conf.estatus ==200) toast.current.show({ severity: 'success', summary: 'Successful', detail: 'despacho Actualizado', life: 3000 });
            }

            setdespachos(_despachos)
            setProductDialog(false)
            setdespacho(emptydespacho)
        }
    }

    const editdespacho = (despacho) => {
        setdespacho({ ...despacho })
        setProductDialog(true)
    }

    const confirmDeletedespacho = (despacho) => {
        setdespacho(despacho)
        setDeleteProductDialog(true)
    }

    const imprimirProductos = async (despacho) => {
        
        try {

            const jsonDirectory = path.join(process.cwd(), '')
            const fileContents = await fs.readFile(jsonDirectory + '/config.json', 'utf8')
            const data = JSON.parse(fileContents)
            const id_despacho = despacho.id_despacho
           const res = await axios.get( data.config.api_v1 + `despacho/products/${id_despacho}`,{
              //withCredentials: true , 
              headers: {
                'Content-Type': 'application/json',
              }              
            },) 
            const lista1 = await res.data     
            console.log(JSON.stringify(lista1))
            generateProductsPDF(lista1)
            //setProductos(lista1)
           } catch (error) {
             console.error('error : ' + error);
           }              
        


        
    }

    const deletedespacho = async () => {
        let _despachos = despachos.filter((val) => val.id_despacho !== despacho.id_despacho)
        setdespachos(_despachos)
        setDeleteProductDialog(false)              
        const conf = await DeletedespachoByid(despacho.id_despacho)
        if (conf ==200)  {
            setdespacho(emptydespacho)
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'despacho Eliminado', life: 3000 })
        }
        
    }

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < despachos.length; i++) {
            if (despachos[i].id === id) {
                index = i;
                break;
            }
        }
        return index
    }


    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true)
    };

    const deleteSelecteddespachos = () => {
        let _despachos = despachos.filter((val) => !selecteddespachos.includes(val));
        setdespachos(_despachos)
        setDeleteProductsDialog(false)
        setSelecteddespachos(null)
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'despachos Eliminados', life: 3000 });
    }


    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _despacho = { ...despacho };
        _despacho[`${name}`] = val;

        setdespacho(_despacho);
    };



    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Nuevo" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                   {/* <Button label="Eliminar" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selecteddespachos || !selecteddespachos.length} />*/}
                </div>
            </React.Fragment>
        );
    };

    const idBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Id</span>
                {rowData.id_despacho}
            </>
        );
    };

    const fechaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Fecha</span>
                {rowData.FechaE}
            </>
        );
    };



    const rutaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Ruta</span>
                {rowData.ruta}
            </>
        )
    }


    const choferBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Chofer</span>
                {rowData.nombre_chofer}
            </>
        );
    };



    const documentosBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Documentos</span>
                {rowData.cant_documentos}
            </>
        )
    }

    

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editdespacho(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mr-2" onClick={() => confirmDeletedespacho(rowData)} />
                <Button icon="pi pi-print" className="p-button-rounded p-button-info"  onClick={() => imprimirProductos(rowData)}  />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">despachos</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const productDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={savedespacho} />
        </>
    );
    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deletedespacho} />
        </>
    );
    const deleteProductsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelecteddespachos} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} ></Toolbar>

                    <DataTable
                        ref={dt}
                        value={despachos}
                        selection={selecteddespachos}
                        onSelectionChange={(e) => setSelecteddespachos(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} despachos"
                        globalFilter={globalFilter}
                        emptyMessage="despachos No Encontrados."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id_despacho" header="id" sortable body={idBodyTemplate} headerStyle={{ minWidth: '5rem' }}></Column>
                        <Column field="FechaE" header="Fecha" sortable body={fechaBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="ruta" header="Zona" body={rutaBodyTemplate} headerStyle={{ minWidth: '18rem' }} sortable></Column>
                        <Column field="nombre_chofer" header="Chofer" body={choferBodyTemplate} sortable></Column>
                        <Column field="cant_documentos" header="Documentos" sortable body={documentosBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>                        
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>


                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {despacho && (
                                <span>
                                    Estas seguro de eliminar <b>{despacho.id_despacho}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {despacho && <span>Estas seguro de Elimiar los despachos seleccionados?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default despachos;
