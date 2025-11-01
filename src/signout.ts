export async function signOut() {
  await fetch("/api/pwd/signout", {
    method: "POST",
  });
  window.location.reload();
}
