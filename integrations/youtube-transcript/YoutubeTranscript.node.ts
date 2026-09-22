// nodes/ExampleNode/YoutubeTranscript.node.ts

import type {
  INodeType,
  INodeTypeDescription,
  INodeExecutionData,
} from 'n8n-workflow';
// 로컬 라이브러리 실제 경로에 맞게 조정
import { YoutubeTranscript } from 'youtube-transcript_custom/dist/youtube-transcript.esm.js';

export class YoutubeTranscriptNode implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'YouTube Transcript',
    name: 'youtubeTranscript',
    icon: 'file:transcript.svg',
    group: ['transform'],
    version: 1,
    description: 'youtube-transcript_custom 라이브러리로 자막을 가져옵니다',
    defaults: { name: 'YouTube Transcript' },
    // 타입 충돌 방지를 위해 그냥 string[] 로 두세요
    inputs: ['main'] as any,
    outputs: ['main'] as any,
    properties: [
      {
        displayName: 'Video URL',
        name: 'videoUrl',
        type: 'string',
        default: '',
      },
      {
        displayName: 'Language',
        name: 'language',
        type: 'string',
        default: 'en',
      },
    ],
  };

  // this: any, 리턴 타입도 any[][]
  async execute(this: any): Promise<any[][]> {
    const items = this.getInputData() as any[];
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      const url = this.getNodeParameter('videoUrl', i) as string;
      const lang = this.getNodeParameter('language', i) as string;

      // 라이브러리의 static 메서드를 호출
      const transcripts = await YoutubeTranscript.fetchTranscript(url, { lang });

      returnData.push({
        json: { videoUrl: url, language: lang, transcripts },
      });
    }

    return this.prepareOutputData(returnData);
  }
}
