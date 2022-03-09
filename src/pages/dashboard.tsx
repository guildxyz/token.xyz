import { SimpleGrid } from "@chakra-ui/react"
import DisplayCard from "components/common/DisplayCard"
import Layout from "components/common/Layout"
import Section from "components/common/Section"

const Page = (): JSX.Element => (
  <Layout title="Dashboard">
    <Section title="My tokens">
      <SimpleGrid
        templateColumns={{ base: "auto 50px", md: "1fr 1fr 1fr" }}
        gap={{ base: 2, md: 6 }}
      >
        <DisplayCard title="Test Token" />
      </SimpleGrid>
    </Section>
  </Layout>
)

export default Page
