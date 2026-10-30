import {Scenario} from "Leaf.lspkg/Scenarios/scenario/Scenario"
import {expect} from "Leaf.lspkg/Utils/common/Expect"
import {sleep} from "Leaf.lspkg/Utils/common/Utils"
import {DefaultLeafInteractor} from "Leaf.lspkg/Interactors/interactor/DefaultLeafInteractor"
import {requiredInteractable, requiredObject, waitForStartup} from "./StreetPropertyLeafHelpers"

@component
export class Criterion3ScatterScenario extends Scenario {
  async run(): Promise<void> {
    await waitForStartup()
    const interactor = new DefaultLeafInteractor("StreetPropertyScatterInteractor")
    await interactor.trigger(requiredInteractable("StreetPropertyClusterMarker"))
    await sleep(650)
    expect(requiredObject("StreetPropertyClusterMarker").isEnabledInHierarchy).toBe(false)
    expect(requiredObject("StreetPropertyMarkerFloor1").isEnabledInHierarchy).toBe(true)
    expect(requiredObject("StreetPropertyMarkerFloor3").isEnabledInHierarchy).toBe(true)
    expect(requiredObject("StreetPropertyMarkerFloor8").isEnabledInHierarchy).toBe(true)
  }
}
