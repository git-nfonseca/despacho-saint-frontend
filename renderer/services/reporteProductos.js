import jsPDF from "jspdf";
import "jspdf-autotable";

// Date Fns is used to format the dates we receive
// from our API call
  
// define a generatePDF function that accepts a tickets argument
export function generateProductsPDF(productos) {
  // initialize jsPDF

  const doc = new jsPDF();


  let empresa, rif, direc1, direc2, telfono;

  // define the columns we want and their titles
  const tableColumn = ["Código", "Descripcion", "Cantidad"];
  // define an empty array of rows
  const tableRows = [];

  empresa = productos[0].NombEmpresa
  direc1 = productos[0].Direc1
  direc2 = ''
  rif = 'J-'
  telfono = productos[0].Telef

  // for each ticket pass all its data into an array
  /*cxc.forEach(item => {
    const Data = [
      item.codigo,
      item.nombre,
      item.total_deuda,
      item.telefono
    ];   
    // push each tickcet's info into a row
    tableRows.push(Data);
  });*/

  
  const body = [...productos.map(el => [el.CodItem, el.Descrip1, el.Cantidad])]

  // startY is basically margin-top
  
  const date = Date().split(" ");
  // we use a date string to generate our filename.
  const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];
  // ticket title. and margin-top + margin-left
  doc.setFontSize(12)
  doc.text(empresa, 15, 7)
  doc.setFontSize(10)
  doc.text(rif, 15, 12)
  doc.text(direc1, 15, 16)
  doc.text(direc2, 15, 20)
  //doc.text(telf, 15, 24)
  doc.setFontSize(12)
  let titulo = "Listado de Productos a despachar"
  let textX = (doc.internal.pageSize.getWidth() - doc.getTextWidth(titulo))/2
   doc.text(titulo, textX, 26);
  // we define the name of our PDF file.
  doc.autoTable({
    head: [["Código", "Descripcion", "Cantidad"]],
    body: body,
    startY: 30 
  });


  //doc.autoTable(tableColumn, tableRows, { startY: 30 });
  doc.save(`report_${dateStr}.pdf`);
}

//************************************************ */
export default {generateProductsPDF}