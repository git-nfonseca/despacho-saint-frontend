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

const transportes = () => {
    let emptytransporte = {
        id: null,
        codigo: '',
        descripcion: '',
        placa : '',
        propietario : '',
        telefonos: '',
        capacidad : 0,
        notas : ''
    };

    const [transportes, settransportes] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [transporte, settransporte] = useState(emptytransporte);
    const [selectedtransportes, setSelectedtransportes] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const apiLogin = getConfig().publicRuntimeConfig.api


//************************* */

  
const  getListaDetransportes = async () => {
  try {

    const jsonDirectory = path.join(process.cwd(), '')
    const fileContents = await fs.readFile(jsonDirectory + '/config.json', 'utf8')
    const data = JSON.parse(fileContents)

    const res = await axios.get(  data.config.api_v1 + 'transp',{
      //withCredentials: true , 
      headers: {
        'Content-Type': 'application/json',
      }              
    },) 
    const lista1 = await res.data     
    settransportes(lista1)  
   } catch (error) {
     console.error('error : ' + error);
   }              
 }
//********************************** */
useEffect(() => {          
    const fetchListaDetransportes = async () => {
        getListaDetransportes()      
    }
    fetchListaDetransportes()

  }, [])
  //***************************************** */

    const openNew = () => {
        settransporte(emptytransporte)
        setSubmitted(false)
        setProductDialog(true)
    };

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
const updatetransporteByid = async (id,datos) => {
    let estatus = 0
    try {        

        const jsonDirectory = path.join(process.cwd(), '')
        const fileContents = await fs.readFile(jsonDirectory + '/config.json', 'utf8')
        const data = JSON.parse(fileContents)

        const res = await axios.put(data.config.api_v1 + `transp/${id}`, datos, {
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
const DeletetransporteByid = async(id) => {
    let estatus = 0
    try {

        const jsonDirectory = path.join(process.cwd(), '')
        const fileContents = await fs.readFile(jsonDirectory + '/config.json', 'utf8')
        const data = JSON.parse(fileContents)

        const res = await axios.delete(data.config.api_v1 + `transp/${id}`,  {
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
const createtransporte = async (datos) => {
    let respuesta = ''
    
    try {

        const jsonDirectory = path.join(process.cwd(), '')
        const fileContents = await fs.readFile(jsonDirectory + '/config.json', 'utf8')
        const data = JSON.parse(fileContents)

        const res = await axios.post(data.config.api_v1 + `transp`, datos,  {
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
    const savetransporte = async () => {
        setSubmitted(true);
        if (transporte.descripcion.trim()) {
            let _transportes = [...transportes]
            let _transporte = { ...transporte }
            if (transporte.id) {
                //alert('editando transporte')
                const index = findIndexById(transporte.id)
                _transportes[index] = _transporte
                const resultado  = await updatetransporteByid(transporte.id,_transporte) 
                if (resultado==200) {
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'transporte Actualizado', life: 3000 })
                }else {
                    alert('Error al grabar el transporte')
                }    
            } else {
                // crear un nuevo transporte
                const conf = await createtransporte(_transporte)
                _transporte.id = parseInt(conf.ultimo_id)
                _transportes.push(_transporte)
                if (conf.estatus ==200) toast.current.show({ severity: 'success', summary: 'Successful', detail: 'transporte Actualizado', life: 3000 });
            }

            settransportes(_transportes)
            setProductDialog(false)
            settransporte(emptytransporte)
        }
    }

    const edittransporte = (transporte) => {
        settransporte({ ...transporte })
        setProductDialog(true)
    }

    const confirmDeletetransporte = (transporte) => {
        settransporte(transporte)
        setDeleteProductDialog(true)
    };

    const deletetransporte = async () => {
        let _transportes = transportes.filter((val) => val.id !== transporte.id)
        settransportes(_transportes)
        setDeleteProductDialog(false)
        settransporte(emptytransporte)
        const conf = await DeletetransporteByid(transporte.id)
        if (conf ==200)  toast.current.show({ severity: 'success', summary: 'Successful', detail: 'transporte Eliminado', life: 3000 })
    }

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < transportes.length; i++) {
            if (transportes[i].id === id) {
                index = i;
                break;
            }
        }
        return index
    }


    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true)
    };

    const deleteSelectedtransportes = () => {
        let _transportes = transportes.filter((val) => !selectedtransportes.includes(val));
        settransportes(_transportes)
        setDeleteProductsDialog(false)
        setSelectedtransportes(null)
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'transportes Eliminados', life: 3000 });
    }


    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _transporte = { ...transporte };
        _transporte[`${name}`] = val;

        settransporte(_transporte);
    };



    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Nuevo" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                   {/* <Button label="Eliminar" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedtransportes || !selectedtransportes.length} />*/}
                </div>
            </React.Fragment>
        );
    };

    const idBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Id</span>
                {rowData.id}
            </>
        );
    };

    const codigoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Código</span>
                {rowData.codigo}
            </>
        );
    };



    const descripcionBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Descripción</span>
                {rowData.descripcion}
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

    const placaBodyTemplate = (rowData) => {
        return (
            <>
                  <span className="p-column-title">Placa</span>
                   {rowData.placa}
            </>
        );
    };


    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => edittransporte(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeletetransporte(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Transportes</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const productDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={savetransporte} />
        </>
    );
    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deletetransporte} />
        </>
    );
    const deleteProductsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedtransportes} />
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
                        value={transportes}
                        selection={selectedtransportes}
                        onSelectionChange={(e) => setSelectedtransportes(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} transportes"
                        globalFilter={globalFilter}
                        emptyMessage="transportes No Encontrados."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="id" sortable body={idBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="codigo" header="codigo" sortable body={codigoBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="descripcion" header="descripcion" body={descripcionBodyTemplate} sortable></Column>
                        <Column field="placa" header="placa" body={placaBodyTemplate} sortable></Column>
                        <Column field="telefonos" header="telefonos" sortable body={telefonosBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>                        
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: '450px' }} header="Nuevo transporte" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="codigo">Codigo</label>
                            <InputText id="codigo" value={transporte.codigo} onChange={(e) => onInputChange(e, 'codigo')} required autoFocus className={classNames({ 'p-invalid': submitted && !transporte.codigo })} />
                            {submitted && !transporte.codigo && <small className="p-invalid">Codigo es requerido</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="descripcion">Descripción</label>
                            <InputText id="descripcion" value={transporte.descripcion} onChange={(e) => onInputChange(e, 'descripcion')}   />
                        </div>

                        <div className="field">
                            <label className="mb-3">Placa</label>
                            <InputText id="placa" value={transporte.placa} onChange={(e) => onInputChange(e, 'placa')}   />
                        </div>

                        <div className="field">
                            <label className="mb-3">Propietario</label>
                            <InputText id="propietario" value={transporte.propietario} onChange={(e) => onInputChange(e, 'propietario')}   />
                        </div>

                        <div className="field">
                            <label className="mb-3">Telefonos</label>
                            <InputText id="telefonos" value={transporte.telefonos} onChange={(e) => onInputChange(e, 'telefonos')}   />
                        </div>

                        <div className="field">
                            <label className="mb-3">Capacidad</label>
                            <InputText type='number' id="capacidad" value={transporte.capacidad} onChange={(e) => onInputChange(e, 'capacidad')}   />
                        </div>


                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {transporte && (
                                <span>
                                    Estas seguro de eliminar <b>{transporte.descripcion}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {transporte && <span>Estas seguro de Elimiar los transportes seleccionados?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default transportes;
