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

import path from 'path'
import { promises as fs } from 'fs'

const Choferes = () => {
    let emptyChofer = {
        id_chofer: null,
        nombre: '',
        cedula: '',
        telefonos: '',
        direccion: ''
    }

    const [choferes, setChoferes] = useState(null)
    const [productDialog, setProductDialog] = useState(false)
    const [deleteProductDialog, setDeleteProductDialog] = useState(false)
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false)
    const [chofer, setChofer] = useState(emptyChofer)
    const [selectedChoferes, setSelectedChoferes] = useState(null)
    const [submitted, setSubmitted] = useState(false)
    const [globalFilter, setGlobalFilter] = useState(null)
    const toast = useRef(null)
    const dt = useRef(null)
    const apiLogin = getConfig().publicRuntimeConfig.api


//************************* */

  
const  getListaDeChoferes = async () => {
  try {

    const jsonDirectory = path.join(process.cwd(), '')
    const fileContents = await fs.readFile(jsonDirectory + '/config.json', 'utf8')
    const data = JSON.parse(fileContents)

   const res = await axios.get( data.config.api_v1  + 'chofer',{
      //withCredentials: true , 
      headers: {
        'Content-Type': 'application/json',
      }              
    },) 
    const lista1 = await res.data     
    setChoferes(lista1)  
   } catch (error) {
     console.error('error : ' + error);
   }              
 }
//********************************** */
useEffect(() => {          
    const fetchListaDeChoferes = async () => {
        getListaDeChoferes()    
    }
    fetchListaDeChoferes()

  }, [])
  //***************************************** */

    const openNew = () => {
        setChofer(emptyChofer)
        setSubmitted(false)
        setProductDialog(true)
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
const updateChoferByid = async (id,datos) => {
    let estatus = 0
    try {   
        
        const jsonDirectory = path.join(process.cwd(), '')
        const fileContents = await fs.readFile(jsonDirectory + '/config.json', 'utf8')
        const data = JSON.parse(fileContents)        

        const res = await axios.put(data.config.api_v1  + `chofer/${id}`, datos, {
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
const DeleteChoferByid = async(id) => {
    let estatus = 0
    try {

        const jsonDirectory = path.join(process.cwd(), '')
        const fileContents = await fs.readFile(jsonDirectory + '/config.json', 'utf8')
        const data = JSON.parse(fileContents)       

        const res = await axios.delete(data.config.api_v1 + `chofer/${id}`,  {
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
const createChofer = async (datos) => {
    let respuesta = ''
    
    try {

        const jsonDirectory = path.join(process.cwd(), '')
        const fileContents = await fs.readFile(jsonDirectory + '/config.json', 'utf8')
        const data = JSON.parse(fileContents)    

        const res = await axios.post(data.config.api_v1 + `chofer`, datos,  {
            headers: {
            'Content-Type': 'application/json',
          }              
        })
      
      respuesta = {
          'estatus' : res.status,
          'ultimo_id': res.data.ultimo_id[0].ultimo_Id
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
    const saveChofer = async () => {
        setSubmitted(true);
        if (chofer.nombre.trim()) {
            let _choferes = [...choferes]
            let _chofer = { ...chofer }
            if (chofer.id_chofer) {
                //alert('editando chofer')
                const index = findIndexById(chofer.id_chofer)
                _choferes[index] = _chofer
                const resultado  = await updateChoferByid(chofer.id_chofer,_chofer) 
                if (resultado==200) {
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Chofer Actualizado', life: 3000 })
                }else {
                    alert('Error al grabar el Chofer')
                }    
            } else {
                // crear un nuevo chofer
                const conf = await createChofer(_chofer)
                _chofer.id_chofer = parseInt(conf.ultimo_id)
                _choferes.push(_chofer)
                if (conf.estatus ==200) toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Chofer Actualizado', life: 3000 });
            }

            setChoferes(_choferes)
            setProductDialog(false)
            setChofer(emptyChofer)
        }
    }

    const editChofer = (chofer) => {
        setChofer({ ...chofer })
        setProductDialog(true)
    }

    const confirmDeleteChofer = (chofer) => {
        setChofer(chofer)
        setDeleteProductDialog(true)
    };

    const deleteChofer = async () => {
        let _choferes = choferes.filter((val) => val.id_chofer !== chofer.id_chofer)
        setChoferes(_choferes)
        setDeleteProductDialog(false)
        setChofer(emptyChofer)
        const conf = await DeleteChoferByid(chofer.id_chofer)
        if (conf ==200)  toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Chofer Eliminado', life: 3000 })
    }

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < choferes.length; i++) {
            if (choferes[i].id_chofer === id) {
                index = i;
                break;
            }
        }
        return index
    }

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true)
    };

    const deleteSelectedChoferes = () => {
        let _choferes = choferes.filter((val) => !selectedChoferes.includes(val));
        setChoferes(_choferes)
        setDeleteProductsDialog(false)
        setSelectedChoferes(null)
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Choferes Eliminados', life: 3000 });
    }


    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _chofer = { ...chofer };
        _chofer[`${name}`] = val;

        setChofer(_chofer);
    };



    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                   {/* <Button label="Nuevo" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />*/}
                   {/* <Button label="Eliminar" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedChoferes || !selectedChoferes.length} />*/}
                </div>
            </React.Fragment>
        )
    }

    const codeBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Id Chofer</span>
                {rowData.id_chofer}
            </>
        );
    };

    const nameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Nombre</span>
                {rowData.nombre}
            </>
        );
    };



    const cedulaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Cédula</span>
                {rowData.cedula}
            </>
        );
    };

    const telefonosBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Telefonos</span>
                {rowData.telefonos}
            </>
        );
    };

    const direccionBodyTemplate = (rowData) => {
        return (
            <>
                  <span className="p-column-title">Dirección</span>
                   {rowData.direccion}
            </>
        );
    };


    const actionBodyTemplate = (rowData) => {
        return (
            <>
               {/* <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editChofer(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteChofer(rowData)} /> */}
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Choferes</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    )

    const productDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveChofer} />
        </>
    )
    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteChofer} />
        </>
    );
    const deleteProductsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedChoferes} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    {/*<Toolbar className="mb-4" left={leftToolbarTemplate} ></Toolbar>*/}

                    <DataTable
                        ref={dt}
                        value={choferes}
                        selection={selectedChoferes}
                        onSelectionChange={(e) => setSelectedChoferes(e.value)}
                        dataKey="id_chofer"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} choferes"
                        globalFilter={globalFilter}
                        emptyMessage="Choferes No Encontrados."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id_chofer" header="Codigo" sortable body={codeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="nombre" header="Nombre" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="cedula" header="Cedula" body={cedulaBodyTemplate} sortable></Column>
                        <Column field="telefonos" header="Telefonos" sortable body={telefonosBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="direccion" header="Direccion" body={direccionBodyTemplate} sortable></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: '450px' }} header="Nuevo Chofer" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="nombre">Nombre</label>
                            <InputText id="nombre" value={chofer.nombre} onChange={(e) => onInputChange(e, 'nombre')} required autoFocus className={classNames({ 'p-invalid': submitted && !chofer.nombre })} />
                            {submitted && !chofer.nombre && <small className="p-invalid">Nombre es requerido</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="cedula">Cedula</label>
                            <InputText id="cedula" value={chofer.cedula} onChange={(e) => onInputChange(e, 'cedula')}   />
                        </div>

                        <div className="field">
                            <label className="mb-3">Telefonos</label>
                            <InputText id="telefonos" value={chofer.telefonos} onChange={(e) => onInputChange(e, 'telefonos')}   />
                        </div>

                        <div className="field">
                            <label className="mb-3">direccion</label>
                            <InputText id="direccion" value={chofer.direccion} onChange={(e) => onInputChange(e, 'direccion')}   />
                        </div>

                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {chofer && (
                                <span>
                                    Estas seguro de eliminar <b>{chofer.nombre}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {chofer && <span>Estas seguro de Elimiar los Choferes seleccionados?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Choferes;
