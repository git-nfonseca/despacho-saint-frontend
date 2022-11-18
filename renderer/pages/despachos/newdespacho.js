import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { Toast } from 'primereact/toast'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { OverlayPanel } from 'primereact/overlaypanel'
import { Dialog } from 'primereact/dialog'
import { Dropdown } from 'primereact/dropdown'
import { Calendar } from 'primereact/calendar'
import { Toolbar } from 'primereact/toolbar'
import React, { useEffect, useRef, useState } from 'react'
import axios from "axios"
import getConfig from 'next/config'
import { useRouter } from 'next/router'

import path from 'path'
import { promises as fs } from 'fs'



const Newdespacho = () =>{
    let emptyDocuByDespach = {
        tipoFac : '',
        numeroD: '',
        codclie:'',
        descripclie: '',
        monto_documento: '',
        peso: 0
    }

    const [rutas, setRutas] = useState(null)
    const [ruta, setRuta] = useState('')
    const [fechae, setFechae] = useState(new Date())
    const [fechar, setFechar] = useState(new Date())
    const [transportes, setTransportes] = useState(null)
    const [choferes, setChoferes] = useState(null)
    const [selectedTransp, setSelectedTransp] = useState(null)
    const [selectedChoferes, setSelectedChoferes] = useState(null)
    const [placa,setPlaca] = useState('')
    const [descripcionTransporte, setDescripcionTransporte] = useState('')
    const [cedulaChofer,setCedulaChofer] = useState('')
    const [nombreChofer,setNombreChofer] = useState('')
    const [telefonoChofer,setTelefonoChofer] = useState('')
    const [autorizadopor,setAutorizadopor] = useState('')
    const [notas,setNotas] = useState('')
    const [documentos,setDocumentos] = useState(null)    
    const [submitted, setSubmitted] = useState(false)
    const [documentDialog, setdocumentDialog] = useState(false)
    const [selectedDocumentos, setselectedDocumentos] = useState(null)
    const [globalFilter, setGlobalFilter] = useState(null)
    const [globalFilterDetalle, setglobalFilterDetalle] = useState(null)

    const [detalleDespacho,setDetalleDespacho] = useState(null)
    const [selecteddetalleD,setselecteddetalleD] = useState(null)
    const [deleteProductDialog, setDeleteProductDialog] = useState(false)


    const [docu, setDocu] = useState(emptyDocuByDespach)
    const router = useRouter()
      
    const apiLogin = getConfig().publicRuntimeConfig.api
    const op2 = useRef(null)
    const op3 = useRef(null)
    const toast = useRef(null)
    const dt = useRef(null)
    const dtDetalle = useRef(null)


    const getAllRutas = async () => {
        try {

            const jsonDirectory = path.join(process.cwd(), '')
            const fileContents = await fs.readFile(jsonDirectory + '/config.json', 'utf8')
            const data = JSON.parse(fileContents)

            const res = await axios.get( data.config.api_v1 + 'ruta',{
                //withCredentials: true , 
                headers: {
                  'Content-Type': 'application/json',
                }              
              },) 
              const lista1 = await res.data  
              setRutas(lista1)
              if (lista1.length > 0 ) setRuta(lista1[0])
        } catch (e) {
            console.error('error : ' + error)
        }
    }

    const getAllTransportes = async () => {
        try {
            const jsonDirectory = path.join(process.cwd(), '')
            const fileContents = await fs.readFile(jsonDirectory + '/config.json', 'utf8')
            const data = JSON.parse(fileContents)

            const res = await axios.get( data.config.api_v1 + 'transp',{
                //withCredentials: true , 
                headers: {
                  'Content-Type': 'application/json',
                }              
              },) 
              const lista1 = await res.data  
              setTransportes(lista1)            
        } catch (e) {
            console.error('error : ' + error)
        }
    }

    const getAlChoferes = async () => {
        try {
            const jsonDirectory = path.join(process.cwd(), '')
            const fileContents = await fs.readFile(jsonDirectory + '/config.json', 'utf8')
            const data = JSON.parse(fileContents)

            const res = await axios.get( data.config.api_v1 + 'chofer',{
                //withCredentials: true , 
                headers: {
                  'Content-Type': 'application/json',
                }              
              },) 
              const lista1 = await res.data  
              setChoferes(lista1)              
        } catch (e) {
            console.error('error : ' + error)
        }
    }

    const getAllDocumentos = async() => {
        try {
            const jsonDirectory = path.join(process.cwd(), '')
            const fileContents = await fs.readFile(jsonDirectory + '/config.json', 'utf8')
            const data = JSON.parse(fileContents)

            const res = await axios.get( data.config.api_v1 + 'doc',{
                //withCredentials: true , 
                headers: {
                  'Content-Type': 'application/json',
                }              
              },) 
              const lista1 =  await res.data  
              setDocumentos(lista1)                   
        } catch (e) {
            console.error('error : ' + error)
        }
    }

    useEffect(() => {          
        const fetchListaDeRutas = async () => {
            getAllRutas()  
            getAllTransportes()
            getAlChoferes()
            getAllDocumentos()
        }
        fetchListaDeRutas()
    
      }, [])

   const toggleDataTable = (event) => {
        op2.current.toggle(event)
    }

    const toggleDataTableChoferes = (event) => {
        op3.current.toggle(event)
    }

    const onTranspSelect = (event) => {
        op2.current.hide()
        const la_placaS = event.data.placa
        const la_descripS = event.data.descripcion
        setPlaca(la_placaS)
        setDescripcionTransporte(la_descripS)
        toast.current.show({ severity: 'info', summary: 'Transporte Selected', detail: event.data.descripcion, life: 3000 })
    }


    const onChoferesSelect = (event) => {
        op3.current.hide()
        const la_cedula = event.data.cedula
        const el_nombre = event.data.nombre
        const el_telf = event.data.telefonos
        setCedulaChofer(la_cedula)
        setNombreChofer(el_nombre)
        setTelefonoChofer(el_telf)
        toast.current.show({ severity: 'info', summary: 'Chofer Selected', detail: event.data.el_nombre, life: 3000 })
    }


    const idBodyTemplate = (rowData) => {
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

    const placaBodyTemplate = (rowData) => {
        return (
            <>
                  <span className="p-column-title">Placa</span>
                   {rowData.placa}
            </>
        )
    }    
//************************************************************** */
const idBodyTemplateChofer = (rowData) => {
    return (
        <>
            <span className="p-column-title">Id</span>
            {rowData.id_chofer}
        </>
    )
}    

const nombreBodyTemplateChofer = (rowData) => {
    return (
        <>
            <span className="p-column-title">Nombre</span>
            {rowData.nombre}
        </>
    )
}    

const cedulaBodyTemplateChofer = (rowData) => {
    return (
        <>
              <span className="p-column-title">Cedula</span>
               {rowData.placa}
        </>
    )
}    


const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
        <h5 className="m-0">Documentos</h5>
        <span className="block mt-2 md:mt-0 p-input-icon-left">
            <i className="pi pi-search" />
            <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
        </span>
    </div>
)

const headerDetalle = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
        <span className="block mt-2 md:mt-0 p-input-icon-left">
            <i className="pi pi-search" />
            <InputText type="search" onInput={(e) => setglobalFilterDetalle(e.target.value)} placeholder="Buscar..." />
        </span>
    </div>
)

//***************************************************************** */
const openDocu = (e) => {
    e.preventDefault()
    setselectedDocumentos(null)    
    setSubmitted(false)
    setdocumentDialog(true)
}

const hideDialog = () => {
    setSubmitted(false)
    setdocumentDialog(false)
}

const leftToolbarTemplate = () => {
    return (
        <React.Fragment>   
            <div className="my-2">
                <Button label="Documentos"  icon="pi pi-copy"  iconPos="right" className="p-button-success mr-2" onClick={openDocu} />
            </div>
        </React.Fragment>
    )
}

const cancelarOperacion = (e) => {
    e.preventDefault()
    router.push("/despachos/");
}

const convertirFecha = (fechaISO) => {
    let date = new Date(fechaISO)
    let year = date.getFullYear()
    let month = date.getMonth()+1
    let dt = date.getDate()
    
    if (dt < 10) {
      dt = '0' + dt
    }
    if (month < 10) {
      month = '0' + month
    }
    let la_Fecha = year+'-' + month + '-'+dt
    return la_Fecha
}

const grabarOperacion= async (e) => {
    e.preventDefault()  
    try {         
        let registro = {
            FechaE : convertirFecha(fechae),
            FechaR : convertirFecha(fechar),
            id_ruta : ruta.id,
            id_chofer : 0,
            cedula_chofer : cedulaChofer,
            nombre_chofer : nombreChofer,
            telefono_chofer : telefonoChofer,
            id_transporte : 0,
            placa_transporte : placa,
            descripcion_transporte : descripcionTransporte,
            autorizado_por : autorizadopor,
            responsable : '',
            estatus : 0,
            notas : notas,
            document : detalleDespacho
        }
        const resp = await createDespacho(registro)
        if (resp.estatus == 200) {
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Despacho creado Exitosamente', life: 3000 })
            router.push("/despachos/") 
        }
    } catch (e) {
        
    }
    
}


const createDespacho = async (datos) => {
    let respuesta = ''
    
    try {

        const jsonDirectory = path.join(process.cwd(), '')
        const fileContents = await fs.readFile(jsonDirectory + '/config.json', 'utf8')
        const data = JSON.parse(fileContents)
        const res = await axios.post(data.config.api_v1 + `despacho`, datos,  {
            headers: {
            'Content-Type': 'application/json',
          }              
        })
      
      respuesta = {
          'estatus' : res.status,
          'ultimo_id': 0
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


const rightToolbarTemplate = () => {
    return (
        <React.Fragment>
             <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={cancelarOperacion} />
             <Button label="Grabar" icon="pi pi-check" className="p-button-text" onClick={grabarOperacion} />            
        </React.Fragment>
    )
}


const documentoBodyTemplate = (rowData) => {
    return (
        <>
            <span className="p-column-title">#Documento</span>
            {rowData.NumeroD}
        </>
    )
}

const numeroDBodyTemplate = (rowData) => {
    return (
        <>
            <span className="p-column-title">#Documento</span>
            {rowData.numeroD}
        </>
    )
}

const descripclienteBodyTemplate = (rowData) => {
    return (
        <>
            <span className="p-column-title">Descripcion</span>
            {rowData.descripclie}
        </>
    )
}

const montodocBodyTemplate = (rowData) => {
    return (
        <>
            <span className="p-column-title">Monto</span>
            {rowData.monto_documento}
        </>
    )
}


const descripBodyTemplate = (rowData) => {
    return (
        <>
            <span className="p-column-title">Descripcion</span>
            {rowData.Descrip}
        </>
    )
}


const montoBodyTemplate = (rowData) => {
    return (
        <>
            <span className="p-column-title">Monto</span>
            {rowData.MtoTotal}
        </>
    )
}

const agregarDocumentosSeleccionados = () => {
    let _documentos = new Array()
    if (detalleDespacho)  _documentos = [...detalleDespacho]
    selectedDocumentos.forEach(element => {
        let _docu = {
            tipoFac : element.TipoFac,
            numeroD : element.NumeroD,
            codclie : element.CodClie,
            descripclie : element.Descrip,
            monto_documento : element.MtoTotal
        }        
        _documentos.push(_docu)        
            
    })
    setDetalleDespacho(_documentos)
    setSubmitted(false)
    setdocumentDialog(false)
}

const documentDialogFooter = (
    <>
        <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
        <Button label="Agregar" icon="pi pi-check" className="p-button-text" onClick={agregarDocumentosSeleccionados}/>
    </>
)




const confirmDeleteDocu = (documento) => {
    setDocu(documento)
    setDeleteProductDialog(true)
}

const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false)
}

const deleteDocudet =  () => {
    let _documentos = detalleDespacho.filter((val) => val.numeroD !== docu.numeroD)
    setDetalleDespacho(_documentos)
    setDeleteProductDialog(false)
    setDocu(emptyDocuByDespach)
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Documento Eliminado', life: 3000 })
}


const deleteProductDialogFooter = (
    <>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
        <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteDocudet} />
    </>
)

const actionBodyTemplate = (rowData) => {
    return (
        <>
            <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteDocu(rowData)} />
        </>
    )
}

//**************************************************************** */
    return (
           
        <div className="grid crud-demo">
            <div className="col-12">

                <div className="card">
                    <Toast ref={toast} />
                    <h5 className="m-2">Nuevo Despacho</h5>

                    <form>
                        <div className="card p-fluid" >
                            <div className="formgrid grid">
                                <div className="field col-12 md:col-4">
                                    <span className="p-float-label">

                                        <Dropdown value={ruta} onChange={(e) => setRuta(e.value)} options={rutas} optionLabel="descripcion" placeholder="Ruta" />

                                    </span>
                                </div>
                                <div className="field col-12 md:col-4">
                                    <span className="p-float-label">
                                        <Calendar inputId="fechae" dateFormat="dd/mm/yy" value={fechar} onChange={(e) => setFechar(e.value)}></Calendar>
                                        <label htmlFor="fechae">Fecha de Registro</label>
                                    </span>
                                </div>
                                <div className="field col-12 md:col-4">
                                    <span className="p-float-label">
                                        <Calendar inputId="fechar" dateFormat="dd/mm/yy" value={fechae} onChange={(e) => setFechae(e.value)}></Calendar>
                                        <label htmlFor="fechar">Fecha del Despacho</label>
                                    </span>
                                </div>
                            </div>
                            <div className="formgrid grid">
                                <div className="field col-4 md:col-4">
                                    <Button type="button" label="Transportes" onClick={toggleDataTable} icon="pi pi-truck" iconPos="right" className="p-button-success" />
                                </div>
                                <OverlayPanel ref={op2} appendTo={typeof window !== 'undefined' ? document.body : null} showCloseIcon id="overlay_panel" style={{ width: '450px' }}>
                                    <DataTable value={transportes} selection={selectedTransp} onSelectionChange={(e) => setSelectedTransp(e.value)} selectionMode="single" responsiveLayout="scroll" paginator rows={5} onRowSelect={onTranspSelect}>
                                        <Column field="id" header="id" sortable body={idBodyTemplate} headerStyle={{ minWidth: '8rem' }} />
                                        <Column field="descripcion" header="Descripción" body={descripcionBodyTemplate} sortable headerStyle={{ minWidth: '10rem' }} />
                                        <Column field="placa" header="Placa" body={placaBodyTemplate} sortable headerStyle={{ minWidth: '8rem' }} />
                                    </DataTable>
                                </OverlayPanel>

                                <div className="field col-6 md:col-4">
                                    <span className="p-float-label">
                                        <InputText type="text" id="placa" value={placa} onChange={(e) => setPlaca(e.target.value)} />
                                        <label htmlFor="placa">Placa</label>
                                    </span>
                                </div>

                                <div className="field col-6 md:col-4">
                                    <span className="p-float-label">
                                        <InputText type="text" id="descripcion" value={descripcionTransporte} onChange={(e) => setDescripcionTransporte(e.target.value)} />
                                        <label htmlFor="descripcion">Descripcion</label>
                                    </span>
                                </div>
                            </div>

                            <div className="formgrid grid">
                                <div className="field col-3 md:col-3">
                                    <Button type="button" label="Choferes" onClick={toggleDataTableChoferes} icon="pi pi-fw pi-id-card" iconPos="right" className="p-button-info" />
                                </div>
                                <OverlayPanel ref={op3} appendTo={typeof window !== 'undefined' ? document.body : null} showCloseIcon id="overlay_panel" style={{ width: '450px' }}>
                                    <DataTable value={choferes} selection={selectedChoferes} onSelectionChange={(e) => setSelectedChoferes(e.value)} selectionMode="single" responsiveLayout="scroll" paginator rows={5} onRowSelect={onChoferesSelect}>
                                        <Column field="id_chofer" header="Id" sortable body={idBodyTemplateChofer} headerStyle={{ minWidth: '8rem' }} />
                                        <Column field="nombre" header="Nombre" body={nombreBodyTemplateChofer} sortable headerStyle={{ minWidth: '10rem' }} />
                                        <Column field="cedula" header="Cedula" body={cedulaBodyTemplateChofer} sortable headerStyle={{ minWidth: '8rem' }} />
                                    </DataTable>
                                </OverlayPanel>

                                <div className="field col-3 md:col-3">
                                    <span className="p-float-label">
                                        <InputText type="text" id="cedula_chofer" value={cedulaChofer} onChange={(e) => setCedulaChofer(e.target.value)} />
                                        <label htmlFor="cedula_chofer">Cédula Chofer</label>
                                    </span>
                                </div>

                                <div className="field col-3 md:col-3">
                                    <span className="p-float-label">
                                        <InputText type="text" id="nombre_chofer" value={nombreChofer} onChange={(e) => setNombreChofer(e.target.value)} />
                                        <label htmlFor="nombre_chofer">Nombre Chofer</label>
                                    </span>
                                </div>

                                <div className="field col-3 md:col-3">
                                    <span className="p-float-label">
                                        <InputText type="text" id="telefono_chofer" value={telefonoChofer} onChange={(e) => setTelefonoChofer(e.target.value)} />
                                        <label htmlFor="telefono_chofer">Teléfono Chofer</label>
                                    </span>
                                </div>
                            </div>

                            <div className="formgrid grid">
                                <div className="field col-6 md:col-6">
                                    <span className="p-float-label">
                                        <InputText type="text" id="autorizado_por" value={autorizadopor} onChange={(e) => setAutorizadopor(e.target.value)} />
                                        <label htmlFor="autorizado_por">Autorizado Por</label>
                                    </span>
                                </div>

                                <div className="field col-6 md:col-6">
                                    <span className="p-float-label">
                                        <InputTextarea id="notas" rows="3" value={notas} onChange={(e) => setNotas(e.target.value)} autoResize></InputTextarea>
                                        <label htmlFor="notas">Notas</label>
                                    </span>
                                </div>
                                

                            </div>
                            <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                        </div>

                    </form>

                    <DataTable
                                ref={dtDetalle}
                                value={detalleDespacho}
                                selection={selecteddetalleD}
                                onSelectionChange={(e) => setselecteddetalleD(e.value)}
                                dataKey="numeroD"
                                paginator
                                rows={10}
                                rowsPerPageOptions={[5, 10, 25]}
                                className="datatable-responsive"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} documentos"
                                globalFilter={globalFilterDetalle}
                                emptyMessage="Documentos No Encontrados."
                                header={headerDetalle}
                                responsiveLayout="scroll"
                            >
                                <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                                <Column field="numeroD" header="#Documento" sortable body={numeroDBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                                <Column field="descripclie" header="Descripcion" sortable body={descripclienteBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                                <Column field="monto_documento" header="Monto" sortable body={montodocBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                                <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>


                    <Dialog visible={documentDialog} style={{ width: '850px' }} header="" modal footer={documentDialogFooter} onHide={hideDialog}>
                        <DataTable
                            ref={dt}
                            value={documentos}
                            selection={selectedDocumentos}
                            onSelectionChange={(e) => setselectedDocumentos(e.value)}
                            dataKey="NumeroD"
                            paginator
                            rows={10}
                            rowsPerPageOptions={[5, 10, 25]}
                            className="datatable-responsive"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} documentos"
                            globalFilter={globalFilter}
                            emptyMessage="Documentos No Encontrados."
                            header={header}
                            responsiveLayout="scroll"
                        >
                            <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                            <Column field="NumeroD" header="#Documento" sortable body={documentoBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                            <Column field="Descrip" header="Descripcion" sortable body={descripBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                            <Column field="MtoTotal" header="Monto" sortable body={montoBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        </DataTable>
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {docu && (
                                <span>
                                    Estas seguro de eliminar el documento: <b>{docu.numeroD}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>



                </div>
            </div>
        </div>
       
    )

}

export default Newdespacho