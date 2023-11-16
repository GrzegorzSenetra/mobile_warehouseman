import * as React from 'react'

export default function Header() {
    return (
        <div>
            <h2>Wyszukiwarka faktur VAT z Allegro</h2>
            <div
              style={{
                backgroundColor: "#aaa",
                paddingLeft: 15,
                paddingRight: 25,
                paddingTop: 2,
                paddingBottom: 2,
                borderRadius: 10,
              }}
            >
              <div
                style={{
                  borderColor: "blue",
                  borderStyle: "solid",
                  borderRight: 0,
                  borderBottom: 0,
                  borderTop: 0,
                  paddingLeft: 10,
                }}
              >
                <h3>Instrukcja</h3>
                <p>Aby wyświetlić faktury do zamówień z allegro, należy:</p>
                <ul>
                  <li>
                    Wejść w Allegro na stronę&nbsp;
                    <a
                      href="https://allegro.pl/moje-allegro/sprzedaz/srodki-i-historia-operacji#!/"
                      target="_blank"
                    >
                      Środki i historia operacji
                    </a>
                  </li>
                  <li>Zaznaczyć i skopiować tabelę</li>
                  <li>
                    Wkleić tabelę do arkusza excel, tabela musi zaczynać się od
                    1 komórki i w pierwszym wierszu muszą być pola nagłówkowe
                    (data, operacja, kupujący, oferta, kwota, środki)
                  </li>
                  <li>Zapisać plik</li>
                  <li>Dodać plik na stronę klikając przycisk "Wybierz plik"</li>
                  <li>
                    Wybrać przedział czasowy w którym szukane będą faktury
                  </li>
                </ul>
                <p>
                  Po zrobieniu powyższych czynności, jeśli wszystko zostało
                  zrobione poprawnie, pojawi się tabela z zamówieniami z Allegro
                  i przypisanymi do nich fakturami.
                </p>
              </div>
            </div>
        </div>
    )
}