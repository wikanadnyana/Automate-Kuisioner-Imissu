import React, { useState } from "react";
import {
  Box,
  Center,
  ChakraProvider,
  extendTheme,
  useColorMode,
  Heading,
  Button,
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
  Link,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Player } from "@lottiefiles/react-lottie-player";
import puppeteer from "puppeteer";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "gray.800", // Dark mode background color
      },
    },
  },
});
export const Dashboard = () => {
  const { colorMode } = useColorMode();
  const cardBackground = "rgba(255, 255, 255, 0.1)";
  const boxShadow = "0 8px 32px 0 rgba(31, 38, 135, 0.37)";
  const backdropFilter = "blur(3px)";
  const borderRadius = "20px";
  const border = `1px solid rgba(255, 255, 255, 0.18)`;

  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const startAutomation = async () => {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto("https://kuisioner-ng.unud.ac.id/dashboard");

      // Memilih Kuisioner
      const [kuisionerDivPbm, kuisionerDivLayanan, kuisionerDivVisiMisi] =
        await Promise.all([
          page.$("#box-kuisioner-pbm"),
          page.$("#box-kuisioner-layanan"),
          page.$("#box-kuisioner-visi-misi"),
        ]);

      if (kuisionerDivPbm) {
        const links = await kuisionerDivPbm.$$(
          "table tbody tr td:last-child a"
        );

        for (const link of links) {
          const spanValue = await link.$eval(
            "span.badge",
            (span) => span.textContent
          );

          if (spanValue === "Kosong" || spanValue === "Sebagian") {
            await link.click();
            let awal = 5;
            for (let i = 1; i <= 40; i++) {
              if (i == 1) {
                await page.click('label[for="jawaban_1_5"]');
              } else {
                let jawab = i * 5 + awal;
                await page.click(`label[for="jawaban_${i}_${jawab}"]`);
              }
            }
            const inputValue = "Seluruh pelaksanaan dari matkul ini sudah baik";

            const inputElement = await page.$(
              'input[name="jawaban[41][jawaban]"].jawaban-option'
            );

            if (inputElement) {
              await inputElement.type(inputValue);
              console.log("Teks berhasil ditambahkan:", inputValue);
            }
            const buttonElement = await page.$("#btn-end");
            if (buttonElement) {
              await buttonElement.click();
              console.log("Tombol berhasil diklik.");
            }
          }
        }
      } else {
        console.log(
          'Elemen div dengan id "box-kuisioner-pbm" tidak ditemukan.'
        );
      }

      if (kuisionerDivLayanan) {
        // Lakukan otomatisasi untuk #box-kuisioner-layanan
        // ...
      } else {
        console.log(
          'Elemen div dengan id "box-kuisioner-layanan" tidak ditemukan.'
        );
      }

      // Lakukan otomatisasi sesuai kebutuhan
      // Contoh: Mengisi input field dengan nilai tertentu
      await page.type('input[name="username"]', "nama_pengguna_anda");

      // Simpan hasil atau tampilkan pesan sukses
      setStatus("Otomatisasi selesai");

      await browser.close();
    } catch (error) {
      setStatus("Terjadi kesalahan saat otomatisasi");
      console.error(error);
    }
  };

  const handleButtonClick = () => {
    startAutomation();
    setIsButtonClicked(true);
  };

  return (
    <ChakraProvider theme={theme}>
      <Center height="100vh">
        <Box
          bg={colorMode === "dark" ? "rgba(0, 0, 0, 0.2)" : cardBackground}
          boxShadow={boxShadow}
          backdropFilter={backdropFilter}
          WebkitBackdropFilter={backdropFilter}
          p={8}
          borderRadius={borderRadius}
          border={border}
          width="600px"
          height="300px"
          textAlign="center"
          color="white"
        >
          {/* Content of the card */}
          <Heading size="lg">Isi Kuisioner Imissu Otomatis🤖</Heading>
          {isButtonClicked ? (
            <Heading size="md" paddingTop="30px">
              Silahkan Cek Imissu!!!
              <Player
                src="https://lottie.host/361141f4-09de-468c-a7da-e3359a3e0671/atczGhEwVb.json"
                className="player"
                loop
                autoplay
                style={{ height: "200px", width: "200px" }}
              />
            </Heading>
          ) : (
            <OrderedList textAlign="left" paddingTop="20px">
              <ListItem>Pastikan udah login imissu</ListItem>
              <ListItem>Pastikan udah buka Kuisioner-NG</ListItem>
              <ListItem>
                Lalu kembali ke website ini dan klik tombol dibawah
              </ListItem>
              <ListItem>
                Selamat, sudah selesai, kalo gamau hubungin @wikanadnyana{" "}
                <Link
                  href="https://www.instagram.com/wikanadnyana/"
                  isExternal
                  textDecoration="underline"
                >
                  <ExternalLinkIcon />
                </Link>
              </ListItem>
            </OrderedList>
          )}
          {!isButtonClicked && (
            <Button
              colorScheme="teal"
              variant="solid"
              marginTop="30px"
              size="lg"
              onClick={handleButtonClick}
            >
              Pencet sini bang
            </Button>
          )}
        </Box>
      </Center>
    </ChakraProvider>
  );
};
