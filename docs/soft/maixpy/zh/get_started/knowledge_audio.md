---
title: 音频处理背景知识
keywords: maixpy, k210, AIOT, 边缘计算
desc: maixpy doc: 音频处理背景知识
---


## 什么是声音（音频）

> 人是理性的，而世界是感性的。

什么是音频，音频即振动。
光粒子的振动形成光波，即光;

而普遍物体的振动形成声波，即声音

## 音频编码基础知识

- 声道数（通道数）

即声音通道的数目，在对声音的记录时，同时记录不同空间位置的音频，即录制多通道音频；

而常见的音频文件有单声道与立体声之分，即单声道记录单一位置的音频，而立体声有左右声道等记录不同空间位置的音频，并可以通过不同的扬声器播放不同通道的音频，从而还原不同空间位置的音频，使人耳通过音频感受不同空间位置（更具有空间感）。

- 采样位数

即采样值或取样值（就是将采样样本幅度量化）。它是用来衡量声音波动变化的一个参数，也可以说是声卡的分辨率。它的数值越大，分辨率也就越高，所发出声音的能力越强。

在计算机中采样位数一般有 8 位和 16 位之分，但有一点请大家注意，8 位不是说把纵坐标分成8份，而是分成 2 的 8 次方即 256 份； 同理 16 位是把纵坐标分成2 的 16 次方 65536 份。

- 采样频率

即取样频率，指每秒钟取得声音样本的次数。采样频率越高，声音的质量也就越好，声音的还原也就越真实，但同时它占的资源比较多。由于人耳的分辨率很有限，太高的频率并不能分辨出来。在 16 位声卡中有 22KHz、44KHz 等几级，其中 22KHz 相当于普通 FM 广播的音质，44KHz 已相当于 CD 音质了，目前的常用采样频率都不超过 48KHz。

## 音频编码处理之 PCM

PCM 介绍

目前我们在计算机上进行音频播放都需要依赖于音频文件，音频文件的生成过程是将声音信息采样、量化和编码产生的数字信号的过程，人耳所能听到的声音，最低的频率是从 20Hz 起一直到最高频率 20Khz，因此音频文件格式的最大带宽是 20Kzh。根据奈奎斯特的理论，只有采样频率高于声音信号最高频率的两倍时，才能把数字信号表示的声音还原成为原来的声音，所以音频文件的采样率一般在 40~50KHZ，比如最常见的 CD 音质采样率 44.1KHZ。

对声音进行采样、量化过程被称为脉冲编码调制（Pulse Code Modulation），简称PCM，而由上文采样频率，采样位数，声道数三个概念可以由下面公式得出在计算机中 PCM 文件所占用的存储空间大小：

PCM 音频数据大小 = (采样频率 * 采样位数 * 声道 * 时间)//8 (单位：Bytes)。

由于 PCM 数据是最原始的音频数据，对于采样的数据完全无损，所以 PCM 数据虽然音质优秀但体积对于计算机的存储还是过于庞大；为了解决这个问题先后诞生了一系列的音频格式，这些音频格式运用不同的方法对音频数据进行压缩，其中有无损压缩（ALAC、APE、FLAC）和有损压缩（MP3、AAC、OGG、WMA）两种。

## WAV

Waveform Audio File Format（WAVE，又或者是因为扩展名而被大众所知的WAV），是微软与 IBM 公司所开发在个人电脑存储音频流的编码格式，在 Windows 平台的应用软件受到广泛的支持，地位上类似于麦金塔电脑里的 AIFF。 此格式属于资源交换档案格式(RIFF)的应用之一，通常会将采用脉冲编码调制的音频资存储在区块中。也是其音乐发烧友中常用的指定规格之一。由于此音频格式未经过压缩，所以在音质方面不会出现失真的情况，但档案的体积因而在众多音频格式中较为大。

所有的 WAV 都有一个文件头，这个文件头音频流的编码参数。WAV 对音频流的编码没有硬性规定，除了 PCM 之外，还有几乎所有支持 ACM 规范的编码都可以为 WAV 的音频流进行编码。WAV 也可以使用多种音频编码来压缩其音频流，不过我们常见的都是音频流被 PCM 编码处理的WAV，但这不表示WAV 只能使用 PCM 编码，MP3 编码同样也可以运用在 WAV 中，和 AVI 一样，只要安装好了相应的 Decode，就可以欣赏这些 WAV了。

在 Windows 平台下，基于 PCM 编码的 WAV 是被支持得最好的音频格式，所有音频软件都能完美支持，由于本身可以达到较高的音质的要求，因此，WAV 也是音乐编辑创作的首选格式，适合保存音乐素材。因此，基于 PCM 编码的 WAV 被作为了一种中介的格式，常常使用在其他编码的相互转换之中，例如 MP3 转换成 WMA。

**而在 MaixPy 中，aduio 模块支持播放的 WAV 文件格式为 PCM_s16le (signed 16 bits little endian, 有符号 16 位小端)**
