/**
 * @example
 * [
 *   [ dir,
 *     [
 *       [ dir,
 *         [
 *           file,
 *           file,
 *         ],
 *       ],
 *       file,
 *       file,
 *     ],
 *   ],
 *   file,
 *   file,
 * ]
 */
export type FileTree = (string | [string, FileTree])[];
