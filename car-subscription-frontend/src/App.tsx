import { Button } from "@components/ui/button";

export default function App() {
  console.log(import.meta.env.VITE_APP_TITLE); // "123"
  console.log(import.meta.env.DB_PASSWORD); // undefined
  return (
    <h1 className="text-3xl font-bold underline">
      {/* Hello world! */}
      {/* <Button children="Button" /> */}
      {/* {import.meta.env.VITE_SOME_KEY} */}
      {import.meta.env.BASE_URL_}
    </h1>
  );
}
