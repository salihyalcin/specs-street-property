import {expect} from "Leaf.lspkg/Utils/common/Expect"
import {nextFrame, sleep, findSceneObjectByName} from "Leaf.lspkg/Utils/common/Utils"
import {findInteractablesByName} from "Leaf.lspkg/Interactors/InteractableUtils"
import {DefaultLeafInteractor} from "Leaf.lspkg/Interactors/interactor/DefaultLeafInteractor"

export function requiredObject(name: string): SceneObject {
  const object = findSceneObjectByName(name)
  expect(object, `Missing SceneObject: ${name}`).toBeTruthy()
  return object!
}

export function requiredInteractable(name: string) {
  const interactable = findInteractablesByName(name, undefined, true)[0]
  expect(interactable, `Missing enabled Interactable: ${name}`).toBeTruthy()
  return interactable
}

export function requiredText(name: string): string {
  const text = requiredObject(name).getComponent("Component.Text") as Text
  expect(text, `Missing Text component: ${name}`).toBeTruthy()
  return text.text
}

export async function waitForStartup(): Promise<void> {
  await sleep(900)
  await nextFrame()
}

export async function expandWithDefaultInteractor(): Promise<DefaultLeafInteractor> {
  const interactor = new DefaultLeafInteractor()
  await interactor.trigger(requiredInteractable("StreetPropertyClusterMarker"))
  await sleep(650)
  return interactor
}
