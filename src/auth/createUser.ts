import { supabase } from "../database/supabase";
import { hash } from "./hash";

const createUser = async (
  uuid: string,
  username: string,
  email: string,
  discord: string,
  password: string
) => {
  try {
    const hashedPassword = hash(password);

    const { error } = await supabase.from("users").insert([
      {
        uuid,
        username,
        email,
        discord,
        password: hashedPassword,
      },
    ]);

    if (error) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.log(error);
  }
};

export { createUser };
