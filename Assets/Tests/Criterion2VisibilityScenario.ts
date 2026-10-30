import {Scenario} from "Leaf.lspkg/Scenarios/scenario/Scenario"
import {expect} from "Leaf.lspkg/Utils/common/Expect"
import {nextFrame} from "Leaf.lspkg/Utils/common/Utils"
import {StreetPropertyMain} from "../Scripts/StreetPropertyMain"
import {requiredObject, waitForStartup} from "./StreetPropertyLeafHelpers"

@component
export class Criterion2VisibilityScenario extends Scenario {
  async run(): Promise<void> {
    await waitForStartup()
    const cluster = requiredObject("StreetPropertyClusterMarker")
    expect(cluster.isEnabledInHierarchy, "Cluster should be visible while the building is in range").toBe(true)
    const main = requiredObject("StreetPropertyInformation").getComponent(StreetPropertyMain.getTypeName()) as StreetPropertyMain
    expect(main, "StreetPropertyMain component is required").toBeTruthy()
    main.maximumVisibleDistanceCm = 100
    await nextFrame()
    await nextFrame()
    expect(cluster.isEnabledInHierarchy, "Cluster should hide after moving beyond visibility range").toBe(false)
  }
}
