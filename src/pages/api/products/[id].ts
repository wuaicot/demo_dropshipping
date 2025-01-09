import type { NextApiRequest, NextApiResponse } from "next";
import { printful } from "../../../lib/printful-client";

type Data = {
    id: string;
    price: number;
    url: string;
};

type ErrorResponse = {
    errors: { key: string; message: string }[];
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data | ErrorResponse>
) {
    const { id } = req.query;

    console.log(`Realizando solicitud a Printful para el ID: ${id}`); // Log antes de la solicitud

    try {
        const { result } = await printful.get(`store/variants/@${id}`);
        console.log(`Respuesta de Printful para el ID ${id}:`, result); // Log de la respuesta exitosa

        res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");

        res.status(200).json({
            id: id as string,
            price: result.retail_price,
            url: `/api/products/${id}`,
        });
    } catch (error) {
        console.error("Error detallado de Printful:", error); // Log del error completo

        if (error.response) { // Si hay una respuesta del servidor
            console.error("Datos de la respuesta de error:", error.response.data); // Log del cuerpo de la respuesta de error
            res.status(error.response.status).json({ // Usa el código de estado del error de Printful
                errors: [{
                    key: error.response.data?.error?.message || `Error en Printful (código ${error.response.status})`, // Mensaje de error más específico
                    message: error.response.data?.error?.message || `Error en Printful (código ${error.response.status})`,
                }],
            });
        } else if (error.request) { // Si no se recibió respuesta
            console.error("No se recibió respuesta del servidor:", error.request);
            res.status(500).json({ errors: [{ key: "Sin respuesta del servidor", message: "Sin respuesta del servidor" }] });
        } else if (error.message) { // Si hubo un error al configurar la solicitud, captura el mensaje
          console.error("Error al configurar la solicitud:", error.message);
          res.status(500).json({ errors: [{ key: error.message, message: error.message }] });
        } else { //Error desconocido
          console.error("Error desconocido:", error);
          res.status(500).json({ errors: [{ key: "Error desconocido", message: "Error desconocido" }] });
        }
    }
}


/*import type { NextApiRequest, NextApiResponse } from "next";



import { printful } from "../../../lib/printful-client";



type Data = {

  id: string;

  price: number;

  url: string;

};



type Error = {

  errors: { key: string; message: string }[];

};



export default async function handler(

  req: NextApiRequest,

  res: NextApiResponse<Data | Error>

) {

  const { id } = req.query;



  try {

    const { result } = await printful.get(`store/variants/@${id}`);



    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");



    res.status(200).json({

      id: id as string,

      price: result.retail_price,

      url: `/api/products/${id}`,

    });

  } catch ({ error }) {

    console.log(error);

    res.status(404).json({

      errors: [

        {

          key: error?.message,

          message: error?.message,

        },

      ],

    });

  }

}*/