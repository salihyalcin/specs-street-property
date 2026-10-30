import {Scenario} from "Leaf.lspkg/Scenarios/scenario/Scenario"
import {expect} from "Leaf.lspkg/Utils/common/Expect"
import {sleep} from "Leaf.lspkg/Utils/common/Utils"
import {expandWithDefaultInteractor, requiredInteractable, requiredObject, waitForStartup} from "./StreetPropertyLeafHelpers"

@component
export class Criterion5CloseScenario extends Scenario {
  async run(): Promise<void> {
    await waitForStartup()
    const interactor = await expandWithDefaultInteractor()
    await interactor.trigger(requiredInteractable("StreetPropertyMarkerFloor1"))
    await sleep(200)
    await interactor.trigger(requiredInteractable("StreetPropertyCloseButton"))
    await sleep(200)
    expect(requiredObject("StreetPropertyListingCard").isEnabledInHierarchy).toBe(false)
    expect(requiredObject("StreetPropertyConnectorLine").isEnabledInHierarchy).toBe(false)
    expect(requiredObject("StreetPropertyMarkerFloor1").isEnabledInHierarchy).toBe(true)
    expect(requiredObject("StreetPropertyMarkerFloor3").isEnabledInHierarchy).toBe(true)
    expect(requiredObject("StreetPropertyMarkerFloor8").isEnabledInHierarchy).toBe(true)
  }
}
