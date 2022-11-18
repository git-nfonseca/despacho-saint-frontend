import path from 'path';
import { promises as fs } from 'fs';

export default async function handler(req, res) {
  //Find the absolute path of the json directory
  const jsonDirectory = path.join(process.cwd(), '');
  //Read the json data file data.json
  //console.log('la ruta del json es :  ' + jsonDirectory + '/config.json')
  //const ruta = 
  const fileContents = await fs.readFile(jsonDirectory + '/config.json', 'utf8');
  //Return the content of the data file in json format
  //console.log(fileContents)
  const data = JSON.parse(fileContents)

  //console.log(a.config.api_v1)
  res.status(200).json(jsonDirectory);
}