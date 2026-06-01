import { RecognitionTag } from "@/store/useImageStore";

const mockTags = [
  { name: "自然风光", keywords: ["山", "水", "天空", "森林", "湖", "海", "云"] },
  { name: "动物", keywords: ["狗", "猫", "鸟", "鱼", "动物", "宠物", "马", "老虎"] },
  { name: "人物", keywords: ["人", "脸", "人物", "肖像", "表情", "眼睛"] },
  { name: "建筑", keywords: ["建筑", "房子", "楼", "塔", "桥", "城市", "街道"] },
  { name: "食物", keywords: ["食物", "水果", "蔬菜", "蛋糕", "咖啡", "饮料", "菜"] },
  { name: "车辆", keywords: ["车", "汽车", "自行车", "飞机", "船", "摩托车"] },
  { name: "科技", keywords: ["手机", "电脑", "屏幕", "键盘", "电子", "设备"] },
  { name: "艺术", keywords: ["画", "艺术", "设计", "图案", "颜色", "装饰"] },
  { name: "植物", keywords: ["花", "树", "叶子", "植物", "花园", "草"] },
  { name: "运动", keywords: ["运动", "球", "跑步", "健身", "比赛", "游戏"] },
];

export const mockImageRecognition = async (
  imageData: string
): Promise<RecognitionTag[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const numTags = Math.floor(Math.random() * 3) + 2;
      const selectedIndices = new Set<number>();
      
      while (selectedIndices.size < numTags) {
        const randomIndex = Math.floor(Math.random() * mockTags.length);
        selectedIndices.add(randomIndex);
      }
      
      const result: RecognitionTag[] = Array.from(selectedIndices).map((index) => ({
        name: mockTags[index].name,
        confidence: parseFloat((0.7 + Math.random() * 0.3).toFixed(2)),
      }));
      
      result.sort((a, b) => b.confidence - a.confidence);
      
      resolve(result);
    }, 1500 + Math.random() * 1000);
  });
};
