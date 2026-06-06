export default function Datenschutzerklaerung() {
  return (
    <div className="max-w-2xl mx-auto my-10 px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Datenschutzerklärung</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Präambel</h2>
        <p className="mb-2">
          Mit der folgenden Datenschutzerklärung informieren wir Sie darüber,
          wie diese Anwendung betrieben wird und welche Daten dabei verarbeitet
          werden.
        </p>
        <p className="text-sm text-gray-400">Stand: Juni 2026</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Verantwortlicher</h2>
        <p>
          Konstantin Booms
          <br />
          Walterstraße 9<br />
          47441 Moers, Deutschland
        </p>
        <p className="mt-2">E-Mail: konstantin.booms@gmail.com</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">
          Keine Erhebung personenbezogener Daten
        </h2>
        <p>
          tradeviz erhebt, speichert oder verarbeitet keine personenbezogenen
          Daten der Nutzer. Es sind keine Nutzerkonten, keine Registrierung und
          keine Anmeldung erforderlich. Es werden keine Cookies gesetzt.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">
          Hosting und Infrastruktur
        </h2>
        <p className="mb-2">
          Die Anwendung wird über folgende Dienste bereitgestellt:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>
              Vercel Inc., 340 Pine Street, Suite 701, San Francisco, CA 94104,
              USA:
            </strong>{" "}
            Hosting des Frontends. Weitere Informationen:
            vercel.com/legal/privacy-policy
          </li>
          <li>
            <strong>Railway Corp., San Francisco, CA, USA:</strong> Hosting des
            Backends. Weitere Informationen: railway.app/legal/privacy
          </li>
          <li>
            <strong>
              Alpaca Securities LLC, 20 N. San Mateo Dr., San Mateo, CA 94401,
              USA:
            </strong>{" "}
            Bereitstellung von Börsendaten (Aktienkurse, Handelsdaten). Die
            Daten werden ausschließlich zur Anzeige von Marktinformationen
            verwendet. Weitere Informationen: alpaca.markets/privacy
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Server-Logs</h2>
        <p>
          Bei der Nutzung der Anwendung können durch die eingesetzten
          Hosting-Dienste (Vercel, Railway) automatisch technische Zugriffsdaten
          wie IP-Adresse, Browsertyp und Zugriffszeit in Server-Logs erfasst
          werden. Diese Daten werden nicht von uns gespeichert oder ausgewertet
          und werden automatisch durch die jeweiligen Anbieter gelöscht.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Börsendaten</h2>
        <p>
          Die in der Anwendung angezeigten Aktienkurse und Marktdaten stammen
          von Alpaca Markets und dienen ausschließlich zu Informationszwecken.
          Die Daten werden in Echtzeit abgerufen und nicht dauerhaft
          gespeichert. tradeviz ist kein lizenzierter Finanzberater. Die
          angezeigten Informationen stellen keine Anlageberatung dar.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">
          Rechte der betroffenen Personen
        </h2>
        <p className="mb-2">
          Da keine personenbezogenen Daten erhoben werden, entfällt die
          Anwendung der meisten datenschutzrechtlichen Betroffenenrechte. Bei
          Fragen wenden Sie sich an: konstantin.booms@gmail.com
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Aufsichtsbehörde</h2>
        <p>
          Landesbeauftragte für Datenschutz und Informationsfreiheit
          Nordrhein-Westfalen
          <br />
          Postfach 20 04 44
          <br />
          40102 Düsseldorf
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Änderungen</h2>
        <p>
          Wir behalten uns vor, diese Datenschutzerklärung anzupassen. Stand:
          Juni 2026.
        </p>
      </section>
    </div>
  );
}
