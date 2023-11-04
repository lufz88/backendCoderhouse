export const generateProductErrorInfo = product => {
	return `Una o más propiedades se encuentran incompletas o no son válidas.
  Lista de propiedades requeridas:
    * title : debe ser un String, se recibió ${product.title}
    * description : debe ser un String, se recibió ${product.description}
    * category : debe ser un String, se recibió ${product.category}
    * price : debe ser un Number, se recibió ${product.price}
    * stock : debe ser un Number, se recibió ${product.stock}
    * code : debe ser un String, se recibió ${product.code}
  `;
};

export const generateUserErrorInfo = user => {
	return `Una o más propiedades se encuentran incompletas o no son válidas.
  Lista de propiedades requeridas:
    * firts_name : debe ser un String, se recibió ${user.first_name}
    * last_name : debe ser un String, se recibió ${user.last_name}
    * age : debe ser un Number, se recibió ${user.age}
    * email : debe ser un String, se recibió ${user.email}
    * password : debe ser un String, se recibió ${user.password}
  `;
};
