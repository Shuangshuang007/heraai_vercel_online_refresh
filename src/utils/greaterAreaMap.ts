export interface GreaterAreaDefinition {
  core: string[];     // 方圆 10 公里以内（权重正常）
  fringe: string[];   // 10–20 公里，次优区域（权重可略降）
}

export const greaterAreaMap: Record<string, GreaterAreaDefinition> = {
  Melbourne: {
    core: [
      "Melbourne", "Southbank", "Docklands", "Carlton", "Parkville", "Fitzroy", "East Melbourne",
      "West Melbourne", "North Melbourne", "South Yarra", "Richmond", "Collingwood",
      "Abbotsford", "Prahran", "St Kilda", "Albert Park", "Port Melbourne", "Toorak", 
      "Hawthorn", "Brunswick", "Brunswick East", "Carlton North", "Camberwell", "Malvern",
      "Cremorne", "Armadale", "Windsor", "St Kilda East", "Prahran East", "South Yarra East",
      "Richmond East", "Burnley"
    ],
    fringe: [
      "Footscray", "Yarraville", "Maribyrnong", "Ascot Vale", "Moonee Ponds", "Essendon",
      "Coburg", "Northcote", "Thornbury", "Caulfield", "Elwood", "Ashburton", "Balwyn", 
      "Box Hill", "Burwood", "Preston", "Ivanhoe", "Heidelberg", "Flemington", "Kensington",
      "Williams Landing", "Tullamarine", "Sunshine", "Braybrook", "Altona", "Glen Iris"
    ]
  },

  Sydney: {
    core: [
      "Sydney", "The Rocks", "Haymarket", "Ultimo", "Glebe", "Pyrmont", "Darlinghurst",
      "Surry Hills", "Redfern", "Chippendale", "Newtown", "Camperdown", "Eveleigh",
      "Paddington", "Woolloomooloo", "Millers Point", "Potts Point", "Barangaroo",
      "Zetland", "Alexandria", "Mascot", "Waterloo"
    ],
    fringe: [
      "North Sydney", "Crows Nest", "Chatswood", "Lane Cove", "Strathfield", "Ashfield",
      "Burwood", "Rhodes", "Concord", "Leichhardt", "Balmain", "Marrickville",
      "Dulwich Hill", "Five Dock", "Drummoyne", "St Peters", "Sydenham", "Hurstville"
    ]
  }
};

/**
 * 检查位置是否属于fringe区域
 * @param location 职位位置
 * @param city 用户选择的城市
 * @returns 是否为fringe区域
 */
export function isFringeLocation(location: string, city: string): boolean {
  const greaterArea = greaterAreaMap[city];
  if (!greaterArea) return false;
  
  const normalizedLocation = location.toLowerCase();
  return greaterArea.fringe.some(fringeLoc => 
    normalizedLocation.includes(fringeLoc.toLowerCase())
  );
}

/**
 * 获取位置权重
 * @param location 职位位置
 * @param city 用户选择的城市
 * @returns 权重系数（fringe区域为0.9，其他为1.0）
 */
export function getLocationWeight(location: string, city: string): number {
  return isFringeLocation(location, city) ? 0.9 : 1.0;
} 