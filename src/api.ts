import axios from "axios";

const url = process.env.REACT_APP_BASEURL;

export const login = async (username, password, callback) => {
  try {
    const loginRes = await axios.post(`${url}/login`, {
      username: username,
      password: password,
    });

    if (loginRes.data.status === true) {
      localStorage.setItem(
        "tokenSession",
        JSON.stringify(loginRes.data.access_token)
      );

      if (typeof callback === "function") {
        callback(loginRes.data);
      }

      return loginRes.data;
    }

  } catch (error) {
    console.log(error);
    alert("Email or Password Incorrect");
  }
};

export const logout = async (callback) => {
  try {
    const getToken = localStorage.getItem("tokenSession");
    const resToken = getToken?.replace(/"/g, "");
    const logoutRes = await axios.post(
      `${url}/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${resToken}`,
        },
      }
    );

    if (typeof callback === "function") {
      callback(logoutRes.data.status);
    }

    return logoutRes;

  } catch (error) {
    console.log(error);
    alert("Logout Error");
  }
};

// export const getUnitKerja = async (callback) => {
//   const getToken = localStorage.getItem("tokenSession");
//   const resToken = getToken?.replace(/"/g, "");
//   const getAllUnitKerja = await axios.get(
//     `${url}/unit`,
//     {
//       headers: {
//         Authorization: `Bearer ${resToken}`,
//       },
//     }
//   );

//   if (typeof callback === "function") {
//     callback(getAllUnitKerja.data.data);
//   }

//   return getAllUnitKerja.data.data;
// }

export const getAllRuas = async (currentPage, callback) => {
  try {
    const getToken = localStorage.getItem("tokenSession");
    const resToken = getToken?.replace(/"/g, "");
    const getAllRuasRes = await axios.get(
      `${url}/ruas?per_page=5&page=${currentPage}`,
      {
        headers: {
          Authorization: `Bearer ${resToken}`,
        },
      }
    );

    const getAllUnitKerja = await axios.get(
      `${url}/unit`,
      {
        headers: {
          Authorization: `Bearer ${resToken}`,
        },
      }
    );

    const dataResult: any= [];
    for (const x of getAllRuasRes.data.data) {
      const dataPush: any = {
        id: x.id,
        unit_id: x.unit_id,
        ruas_name: x.ruas_name,
        long: x.long,
        km_awal: x.km_awal,
        km_akhir: x.km_akhir,
        photo_url: x.photo_url,
        doc_url: x.doc_url,
        status: x.status,
        created_at: x.created_at,
        updated_at: x.updated_at,
        unitKerja: getAllUnitKerja.data.data.filter(r => r.id === x.unit_id).map(r => r.unit).join(),
      }
      dataResult.push(dataPush);
    }
    console.log(JSON.stringify(dataResult));

    if (typeof callback === "function") {
      callback(dataResult);
    }

    return dataResult;

  } catch (error) {
    console.log(error);
    alert("Get All Ruas Error");
  }
};

// export const getOneRuas = async (id, callback) => {
//   try {
//     const getToken = localStorage.getItem("tokenSession");
//     const resToken = getToken?.replace(/"/g, "");
//     const getOneRuasRes = await axios.get(`${url}/ruas/${id}`, {
//       headers: {
//         Authorization: `Bearer ${resToken}`,
//       },
//     });

//     if (typeof callback === "function") {
//       callback(getOneRuasRes.data.data);
//     }

//     return getOneRuasRes.data.data;

//   } catch (error) {
//     console.log(error);
//   }
// };

export const addRuas = async (data, callback) => {
  const formData = new FormData();
  const getToken = localStorage.getItem("tokenSession");
  const resToken = getToken?.replace(/"/g, "");

  for (const key in data) {
    if (key === "file" || key === "photo") {
      formData.append(key, data[key][0]);
    } else {
      formData.append(key, data[key]);
    }
  }

  try {
    const addRuasRes = await axios.post(`${url}/ruas`, formData, {
      headers: {
        Authorization: `Bearer ${resToken}`,
      },
    });

    if (addRuasRes.data.status === true) {
      if (typeof callback === "function") {
        callback(addRuasRes.data);
      }

      return addRuasRes.data;
    }

  } catch (error) {
    console.log(error);
    alert("Add Data Failed");
  }
};

export const updateRuas = async (data, id, callback) => {
  const formData = new FormData();
  const getToken = localStorage.getItem("tokenSession");
  const resToken = getToken?.replace(/"/g, "");
  formData.append("_method", "PUT");

  for (const key in data) {
    if (key === "file" || key === "photo") {
      formData.append(key, data[key][0]);
    } else {
      formData.append(key, data[key]);
    }
  }

  try {
    const updateRuasRes = await axios.post(`${url}/ruas/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${resToken}`,
      },
    });

    if (updateRuasRes.data.status === true) {
      if (typeof callback === "function") {
        callback(updateRuasRes.data);
      }

      return updateRuasRes.data;
    }
  
  } catch (error) {
    console.log(error);
    alert("Update Failed");
  }
};

export const deleteRuas = async (id, callback) => {
  try {
    const getToken = localStorage.getItem("tokenSession");
    const resToken = getToken?.replace(/"/g, "");
    const deleteRuasRes = await axios.delete(`${url}/ruas/${id}`, {
      headers: {
        Authorization: `Bearer ${resToken}`,
      },
    });

    if (deleteRuasRes.data.status === true) {
      if (typeof callback === "function") {
        callback(deleteRuasRes.data);
      }

      return deleteRuasRes.data;
    }
  } catch (error) {
    console.log(error);
    alert("Delete Failed");
  }
};
