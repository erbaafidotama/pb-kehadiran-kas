import supabase from "../supabase";

export async function getListMembers() {
  const { data } = await supabase.from("tbl_member").select();
  // setMembers(data);
  return data;
}
