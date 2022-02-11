import Card from "./Card"
import Spacer from "./Spacer"

function Main() {
  return (
    <div className="container mx-auto">
      <h2 className="text-xl font-bold basis-full justify-center"> Latest NFTs</h2>
      <Spacer space={32}/>
      <div className="container grid grid-flow-col-dense gap-2">
        <Card title="Titolo" description="Descrizione" image="https://lh3.googleusercontent.com/3Tr3Lhlcm1Zqs8INDS6oKGe5ChtoqTouGyaPSPsSaRCM-TZZ6E3OgjUayD4xWKjeWSpNCdSOopa3E6tLIHI522M5wdXXj4Q_uN6D=w600" link="https://opensea.io/assets/0x495f947276749ce646f68ac8c248420045cb7b5e/23443662500946835264283410846443095105284164377306294737980798252351638994945"/>
        <Card title="Titolo" description="Descrizione" image="https://lh3.googleusercontent.com/3Tr3Lhlcm1Zqs8INDS6oKGe5ChtoqTouGyaPSPsSaRCM-TZZ6E3OgjUayD4xWKjeWSpNCdSOopa3E6tLIHI522M5wdXXj4Q_uN6D=w600" link="https://opensea.io/assets/0x495f947276749ce646f68ac8c248420045cb7b5e/23443662500946835264283410846443095105284164377306294737980798252351638994945"/>
        <Card title="Titolo" description="Descrizione" image="https://lh3.googleusercontent.com/3Tr3Lhlcm1Zqs8INDS6oKGe5ChtoqTouGyaPSPsSaRCM-TZZ6E3OgjUayD4xWKjeWSpNCdSOopa3E6tLIHI522M5wdXXj4Q_uN6D=w600" link="https://opensea.io/assets/0x495f947276749ce646f68ac8c248420045cb7b5e/23443662500946835264283410846443095105284164377306294737980798252351638994945"/>
        <Card title="Titolo" description="Descrizione" image="https://lh3.googleusercontent.com/3Tr3Lhlcm1Zqs8INDS6oKGe5ChtoqTouGyaPSPsSaRCM-TZZ6E3OgjUayD4xWKjeWSpNCdSOopa3E6tLIHI522M5wdXXj4Q_uN6D=w600" link="https://opensea.io/assets/0x495f947276749ce646f68ac8c248420045cb7b5e/23443662500946835264283410846443095105284164377306294737980798252351638994945"/>
        <Card title="Titolo" description="Descrizione" image="https://lh3.googleusercontent.com/3Tr3Lhlcm1Zqs8INDS6oKGe5ChtoqTouGyaPSPsSaRCM-TZZ6E3OgjUayD4xWKjeWSpNCdSOopa3E6tLIHI522M5wdXXj4Q_uN6D=w600" link="https://opensea.io/assets/0x495f947276749ce646f68ac8c248420045cb7b5e/23443662500946835264283410846443095105284164377306294737980798252351638994945"/>
      </div>
    </div>
  )
}

export default Main
