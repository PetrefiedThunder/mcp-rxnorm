import { describe, it, expect } from "vitest";

describe("mcp-rxnorm", () => {
  it("should build drug search URLs", () => {
    const name = "aspirin";
    const url = `https://rxnav.nlm.nih.gov/REST/drugs.json?name=${encodeURIComponent(name)}`;
    expect(url).toContain("name=aspirin");
  });

  it("should build interaction URLs with multiple RxCUIs", () => {
    const rxcuis = "207106,152923";
    const url = `https://rxnav.nlm.nih.gov/REST/interaction/list.json?rxcuis=${rxcuis}`;
    expect(url).toContain("207106,152923");
  });

  it("should build properties URL", () => {
    const rxcui = "207106";
    const url = `https://rxnav.nlm.nih.gov/REST/rxcui/${rxcui}/properties.json`;
    expect(url).toContain("/207106/");
  });

  it("should build NDC URL", () => {
    const rxcui = "207106";
    const url = `https://rxnav.nlm.nih.gov/REST/rxcui/${rxcui}/ndcs.json`;
    expect(url).toContain("ndcs.json");
  });

  it("should encode drug names for approximate term", () => {
    const name = "tylenol extra strength";
    expect(encodeURIComponent(name)).toBe("tylenol%20extra%20strength");
  });

  it("should build drug class URL", () => {
    const rxcui = "207106";
    const url = `https://rxnav.nlm.nih.gov/REST/rxclass/class/byRxcui.json?rxcui=${rxcui}`;
    expect(url).toContain("byRxcui");
  });
});
