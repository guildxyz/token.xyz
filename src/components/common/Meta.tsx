import Head from "next/head"

type Props = {
  title: string
  description?: string
}

const Meta = ({ title, description }: Props): JSX.Element => (
  <Head>
    <title>{title}</title>
    <meta property="og:title" content={title} />
    {description && (
      <>
        <meta name="description" content={description} />
        <meta property="og:description" content={description} />
      </>
    )}
  </Head>
)

export default Meta
