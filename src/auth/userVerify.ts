import { supabase } from "../database/supabase";

const userVerify = async (username: String, email: String, discord: String) => {
  const { data, error } = await supabase.from("users").select();
  if (data) {
    let response = data.map((element) => {
      if (element.username === username)
        return { message: "Este username está em uso.", success: false };
      else if (element.email === email)
        return { message: "Este email está em uso.", success: false };
      else if (element.discord === discord)
        return { message: "Este discord está em uso.", success: false };
      else return { message: null, success: true };
    });
    return response?.[0];
  } else {
    console.log(error);
    return null;
  }
};

export { userVerify };
